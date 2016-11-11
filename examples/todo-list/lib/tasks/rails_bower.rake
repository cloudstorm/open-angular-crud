namespace :rails_bower do
  desc "Install both dependencies and devDependencies from bower (tweeked)"
  task :install, :options do |_, args|
    args.with_defaults(:options => '')

    puts 'Installing to /tmp/bower'

    target = File.join('/tmp', 'bower')
    FileUtils.mkdir_p target unless File.directory? target

    BowerRails.root_path = '/tmp/bower'
    sh "cp Bowerfile .bowerrc #{BowerRails.root_path}"

    BowerRails::Performer.perform do |bower|
      sh "#{bower} install #{args[:options]}"
    end

    asset_path = Rails.root.join('vendor', 'assets')
    sh "cp -R /tmp/bower/vendor/assets/* #{asset_path}"
  end
end
