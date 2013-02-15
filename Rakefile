require 'rubygems'
require 'ejs'

desc "Precompile templates"
task :tmpl do
  str = []
  
  Dir.glob('templates/*.tmpl').each do |file|
    name = get_name(file)
    tmpl = EJS.compile get_contents(file)
    
    str << "PD.tmpl.#{name}=#{tmpl};\n"
  end
  
  File.open('js/_templates.js', 'w') do |file|
    file.write "(function(PD){\n#{str.join ''}}(window.PD));"
    
    puts "#{str.count} templates compiled"
  end
end

def get_contents(file)
  strip_newlines = ['protein_highlight', 'dna_highlight']
  
  name     = get_name(file)
  contents = File.read(file)
  
  if strip_newlines.include? name
    contents.gsub(/^\s+/, '').gsub(/\n|\r/, '')
  else
    contents
  end 
end

def get_name(file)
  File.basename(file, '.tmpl')
end