require 'octokit'
require 'uri'
require 'json'
require 'open-uri'

data = URI.parse("https://govuk-digital-services.herokuapp.com/data.json")

services = JSON.parse(data.read)

services_with_source_code = []

services["services"].each do |service|
  next unless service["sourceCode"] && service["sourceCode"].length > 0
  next if service["phase"] == "Retired"

  service["sourceCode"].each do |source_code|

    next if source_code["text"].downcase.include? "prototype"
    next unless source_code["href"].start_with? "https://github.com/"

    github_repo = source_code["href"].gsub("https://github.com/", "")

    services_with_source_code << {service: service["name"], repo: github_repo, name: source_code["text"]}
  end

end

data = JSON.parse(File.read("data.json"))
count = 0

client = Octokit::Client.new(:access_token => ENV.fetch('GITHUB_TOKEN'))

puts "Scanning the package.json of source code"

services_with_source_code.each do |service|

  service_metadata = data["repos"].find {|s| s["repo"] == service[:repo] }

  if service_metadata.nil?
    service_metadata = {
      "repo": service[:repo]
    }
    data["repos"] << service_metadata
  end

  # Update service name
  service_metadata["serviceName"] = service[:service]

  # Update source code name
  source_code_name = service[:name].gsub(/source code/i, "").strip

  if !source_code_name.empty?
    service_metadata["name"] = source_code_name
  else
    service_metadata.delete("name")
  end

  # Skip if skipped
  next if service_metadata["skip"] == true

  package_path = service_metadata["packageLocation"].to_s + "package.json"

  begin
    package_json = JSON.parse(Base64.decode64(client.contents(service[:repo], path: package_path).content))

    print "."
    $stdout.flush

    if package_json["dependencies"] && package_json["dependencies"]["govuk-frontend"]
      service_metadata["govukversion"] = package_json["dependencies"]["govuk-frontend"]
    else
      service_metadata["skip"] = "maybe"
    end

  rescue Octokit::InvalidRepository
    service_metadata["skip"] = "maybe"
  rescue Octokit::NotFound
    service_metadata["skip"] = "maybe"
  end

  count += 1
end

# Update data file
File.open("data.json", 'w') do |file|
  file.write(JSON.pretty_generate(data))
end

repos_with_govuk_frontend = data["repos"].select {|repo|  repo["govukversion"] }

repos_with_govuk_frontend.sort! do |a, b|
  version_a = a["govukversion"].gsub(/[\^\~]/, "")
  version_b = b["govukversion"].gsub(/[\^\~]/, "")

  if version_a < version_b
    1
  elsif version_a > version_b
    -1
  else
    a["serviceName"] <=> b["serviceName"]
  end
end

# Update README.md
File.open("README.md", 'w') do |file|

  file.write "# GOV.UK services - govuk-frontend version status\n\n\n"

  file.write "This shows the current known govuk-frontend version of services, based on their public source code.\n\n"

  file.write "| Service | govuk-frontend version |\n"
  file.write "| ------- | --------------------- |\n"

  repos_with_govuk_frontend.each do |repo|

    display_name = repo["serviceName"].to_s

    other_repos_for_same_service = repos_with_govuk_frontend.detect do |other_repo|
      (other_repo["serviceName"] == repo["serviceName"]) && (other_repo["repo"] != repo["repo"])
    end

    if other_repos_for_same_service && repo["name"]
      display_name += " (" + repo["name"] + ")"
    end

    file.write "| [" + display_name + "](https://github.com/" + repo["repo"].to_s + "/" + repo["packageLocation"].to_s + ") | " + repo["govukversion"].to_s + " |\n"
  end

  file.write "\n"

end


