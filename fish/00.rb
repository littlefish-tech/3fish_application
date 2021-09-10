require 'mysql2'
require 'sequel'
require 'json'
require 'ostruct'

require_relative '../calendar/events'
require_relative '../calendar/user'


DB = Sequel.connect(:adapter => 'mysql2', :user => 'root', :host => 'localhost', :database=> '3fish')
$uDB = UserDB.new(DB[:userDB])
$eDB = EventDB.new(DB[:eventDB])

foo = $uDB.getAllUsers

puts JSON.generate(foo)

