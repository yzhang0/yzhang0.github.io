# frozen_string_literal: true
module BundlerHack
  def __materialize__
    if name == 'grpc' || name == 'google-protobuf'
      Bundler.settings.temporary(force_ruby_platform: true) do
        super
      end
    else
      super
    end
  end
end
Bundler::LazySpecification.prepend(BundlerHack)

source "https://rubygems.org"

git_source(:github) {|repo_name| "https://github.com/#{repo_name}" }

# gem "rails"

gem "jekyll", "~> 4.3"
