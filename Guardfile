# A sample Guardfile
# More info at https://github.com/guard/guard#readme
require 'guard/guard'

module ::Guard
  class InlineEJS < ::Guard::Guard
    def run_all
    end

    def run_on_changes(paths)
      UI.info paths
      Notifier.notify `bundle exec rake tmpl`
    end
  end
end

guard :inlineEJS do
  watch(%r{^templates/.+\.tmpl})
end
