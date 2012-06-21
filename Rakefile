require 'rubygems'
require 'ejs'

desc "Precompile templates"
task :tmpl do
  str = []
  
  Dir.glob('templates/*.tmpl').each do |file|
    name = File.basename(file, '.tmpl')
    tmpl = EJS.compile File.read(file)
    
    str << "PD.tmpl.#{name}=#{tmpl};"
  end
  
  File.open('js/_templates.js', 'w') do |file|
    file.write "(function(){#{str.join ''}}());"
    
    puts "#{str.count} templates compiled"
  end
end