class Revision

  REVISION_FILE_PATH = Rails.root.join('lib', 'revision')

  def self.hash
    return @hash if @hash
    fetch
  end

  def self.fetch
    if File.exist?(REVISION_FILE_PATH)
      rev_file = File.open(REVISION_FILE_PATH)
      @hash = rev_file.read.strip
    else
      @hash = ''
    end
    @hash
  end

end
