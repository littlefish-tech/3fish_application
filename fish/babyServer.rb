require 'sinatra'
require 'sinatra/base'
require 'mysql2'
require 'sequel'
require 'chronic'
require 'json'
require 'mongo'

require_relative '../calendar/events'
require_relative '../calendar/user'

$TESTING = true;


DB = Sequel.connect(:adapter => 'mysql2', :user => 'root', :password => 'myfakepassword', :host => 'localhost', :database=> '3fish')
$uDB = UserDB.new(DB[:userDB])
$eDB = EventDB.new(DB[:eventDB])

Mongo::Logger.logger.level = Logger::FATAL
$mC = Mongo::Client.new([ 'localhost:27017' ], :database => '3f')

$cD = $mC[:cityData] # choose the collection named  cityData
$uPre = $mC[:userPref]  ## userPref collection


def saveSession(session)
  ## should replace if already there
  $uPre.find(:userName => session['userName']).delete_many
  $uPre.insert_one(session)
end

def getSession(uName)
  s = nil;
  
  $uPre.find(:userName => uName).each do |session|
      s = session
      break
  end

  return s

end

def findCityByCoord(lat, lon)

  c = $cD.find(
    { 'location' =>
      { "$near" =>
        { "$geometry" =>
          { "type" => "Point",  "coordinates" => [ lon, lat ] },
            "$maxDistance" => 5000
        }
      }
    }
  )
  cityHash = Hash.new
## if not find any city, return an empty hash, but if find any city, return the first one
  c.each{|x|
    cityHash["city"] = x['name']
    cityHash['id'] = x['id']
    cityHash['state'] = x['state']
    cityHash['country'] = x['country']
    break
  }
  return cityHash
end


def secCheck(uName)
  return true if $TESTING;
  
  if (!session[:curUser]) || (session[:curUser].name != uName)
    puts "something fishy is going on.. #{uName} is not in this session"
    session[:curUser] = nil;
    return false;
  end  
end

def logSessionInfo
#  puts session.inspect
end


def logSessionUser(prefix="")
  prefix = prefix + ": " if prefix.length > 0
  print ">>> #{prefix} Session  #{session["session_id"]}"
  userName = session["curUser"] ? session["curUser"].name : "<nouser>"
  print " logged in with [#{userName}]\n" 
end

class SinatraApp < Sinatra::Base

  set :bind, '0.0.0.0'  # listen for external connections also
  set :port, 9999    # server starts on port 9999
  set :public_folder, './build' # static files live in the webpages directory


  enable :sessions  # we have enabled sessions for each browser

  # get '/events' do
    
  #   output = "<h1> Event List </h1> <br>"
  #   output << "No events"
  #   output 
  # end

  get '/users' do   # /users?name=<whatever>  only print users with <> in name
    
    # we are looking for a URL that starts with /users
    # we also handle a filter.. of the type ?name=<string>

    #match = params['name']   # if ?name=<string> is in the URL, then match is <string>
    # if not, then match is nil
    matchColumn = ""
    matchValue  = ""

    params.each_pair{|k, v|
      matchColumn = k
      matchValue  = v
    }

    matchAll = params.length == 0
    
  #  #  output = "<h1>Users are ...</h1>" << "<br>"
  #   output = ""
  #   $uDB.getAllUsers.each{|u|
  #     if matchAll
  #       output << u.userToString  << "<br>"  # put everyone
  #     else
  #       output << u.userToString  << "<br>" if eval("u.#{matchColumn}").include?(matchValue)
  #       # put only matching
  #     end
  #   }

  #   output

    return JSON.generate($uDB.getAllUsers)
  end

  ### 
  def serveFile(f)
    return File.read(f)
  end

  get '/' do
    logSessionInfo
    logSessionUser
    
    if (session[:curUser])
      return ""
    else
    return serveFile('build/index.html')
    end
  end


  post '/loginVerify' do
    logSessionInfo
    logSessionUser
    # requests['uname'] uname
    # requests['passwd'] passwd
    ## verify this at the database
    ##  if ok, let the user login

    # if not go back
    # request is what came from the client / browser / frontend




    uP = JSON.parse(request.body.read)
    #puts request.params.inspect

    uname = uP['userName']   # this is what the user typed in
    passwd = uP['passWord'] # this is what the user typed in

    if session[:curUser]
      loginOK = false
    else
      loginOK = $uDB.verifyLogin(uname, passwd) # verify login in database
    end

    failedLogin = User.new(-1) ## bad user ID

    if loginOK
      session[:curUser] = $uDB.getUserByName(uname)
      logSessionUser("after loginOK")
      
      ### we have a new logged in user!!
      uJ = JSON.generate(session[:curUser])
    else
      uJ = JSON.generate(failedLogin)
    end
    return uJ
  end

  post '/userExists' do
    logSessionInfo
    # no security check needed
    
    uName =  JSON.parse(request.body.read)["userName"]
    u = $uDB.getUserByName(uName)
    # puts "got user #{u.inspect} for name #{uName}"
    
    return JSON.generate(u != nil) ;  
    
  end
  

  post "/register" do
    logSessionInfo
    logSessionUser("in Register")
    # no security check needed??
    
    uP = JSON.parse(request.body.read)
    uname = uP['userName']
    passwd = uP['passWord']
    email = uP['email']
    location = uP['location']

    regUser = User.new
    regUser.name = uname
    regUser.password = passwd
    regUser.email = email
    regUser.location = location
    
    id = $uDB.newUser(regUser)
    if id
      regUser.id = id
    else
      regUser.id = -1
    end

    # failedReg = User.new(-1)
    # if !id 
    #   uJ = JSON.generate(failedReg)
    # else
    #   session[:curUser] = regUser
    #   uJ = JSON.generate(session[:curUser])
    # end
    puts regUser.inspect

    rU = JSON.generate(regUser)
    return rU
  end


  post '/logOut' do
    logSessionInfo
    logSessionUser("in logOut")
    session[:curUser] = nil
    
    logoutUser = User.new(-1)    
    uJ = JSON.generate(logoutUser)


    logSessionUser("after logOut")
    
    return uJ
  end
  

  # get '/Start' do
  #   if !session[:curUser]  # unique/different for each session
  #     redirect '/login' ## we have no user right now
  #     return 
  #   end

    #    name = session[:curUser].name
    

    ## show the main menu options

    #"Welcome, #{name}<br><br><hline><a href='/logOut'>Logout</a>"
  #return serveFile('local/homepage.html')
    
#  end

  post "/updateUser" do
    logSessionInfo
    logSessionUser("in updateUser")
    
    uP = JSON.parse(request.body.read)
    uame = uP['userName']
    passwd = uP['passWord']
    email = uP['email']
    location = uP['location']

    if !secCheck(uname)
      return Json.generate(nil);
    end

    regUser = $uDB.getUserByName(uname)
    regUser.password = passwd
    regUser.email = email
    regUser.location = location

    $uDB.update(regUser)

    # failedReg = User.new(-1)
    # if !id 
    #   uJ = JSON.generate(failedReg)
    # else
    #   session[:curUser] = regUser
    #   uJ = JSON.generate(session[:curUser])
    # end
    puts regUser.inspect

    rU = JSON.generate(regUser)
    return rU

  end

  post "/addEvent" do
    logSessionUser("in add event")
    uP = JSON.parse(request.body.read)
    uName = uP["userName"]
    creator = uP["creator"]
    event_name = uP["event_name"]
    startTime = uP["startTime"]
    duration = uP["duration"]
    detail = uP["detail"]

    if !secCheck(uName) 
      return Json.generate(nil);
    end
 
    newEvent = Event.new

    puts uP.inspect
    
    
    newEvent.creator =  creator
    newEvent.event_name =  event_name

    puts "parsing time"
    newEvent.time =  startTime  # do a  validation

    puts "parsing duration"
    newEvent.duration =  duration # do a valdation here

    puts "parsing detail"
    newEvent.detail =  detail

    id = $eDB.addEvent(newEvent)
    newEvent.id = id

    if id
      newEvent.id = id
    else
      newEvent.id = -1
    end

    puts "where is the new event #{newEvent.inspect}"
    nU = JSON.generate(newEvent)

    return nU
    
  end


  post '/getAllEvents' do
    logSessionInfo
    logSessionUser("in getAllEvents")
    ## we are NOT doing the session check.. add this later


    uP = JSON.parse(request.body.read)
    uName = uP['userName']   # this is what the user typed in

    

    ###  SECURITY CHECK that the user is not being spoofed
    if !secCheck(uName) 
      return Json.generate([]);
    end

    sleep(0.5)
    
    u = $uDB.getUserByName(uName)
    uid = u.id

    eList = $eDB.byUser(uid);

    eJ = JSON.generate(eList)
    return eJ
  end

  post '/deleteEvent' do

    logSessionInfo
    logSessionUser("in deleteEvent")

    uP = JSON.parse(request.body.read)
    uName = uP['userName']   # this is what the user typed in
    eId = uP['eventID']

    puts (uP.inspect)

    puts "=-----="
    

    ###  SECURITY CHECK that the user is not being spoofed
    if !secCheck(uName) 
      return Json.generate([]);
    end
    
    ret = $eDB.deleteEvent(eId)

    

    e = JSON.generate(ret)
    return e
        
  end
  
  post "/getCityInfo" do
    logSessionInfo
    logSessionUser("in getCityInfo")

    uP = JSON.parse(request.body.read)
    uName = uP['userName']   # this is what the user typed in
    lat = uP['lat']
    lon = uP['lon']

    puts uP.inspect

    c = findCityByCoord(lat, lon)
    puts (c.inspect)

    cInfo = JSON.generate(c)
    return cInfo
  end


  post "/saveSessionInfo" do
    logSessionInfo
    logSessionUser("in saveSessionInfo")

    uP = JSON.parse(request.body.read)
    uName = uP["userName"]

    saveSession(uP)


   return JSON.generate(true)
  
  end

  # def saveUserPro(uPreference)
  #   logSessionInfo
  #   logSessionUser("in saveUserInfo")
  
  #   uPreHash[:uName] = uProference["Creds"]["name"]
  #   uPreHash[:Layout] = uProference["Layout"]
  #   uPreHash[:Creds] = uProference["Creds"]
  #   uPreHash[:Grids] = uProference["Grids"]
  #   uPreHash[:AppData] = uProference["AppData"]
  
  #   uPreHash.insert_one(uPre)
  
  # end

  post "/restoreSessionInfo" do
    logSessionInfo
    logSessionUser("in restoreSessionInfo")

    uP = JSON.parse(request.body.read)
    uName = uP["userName"]

    sI = getSession(uName)

    puts "Found  session :#{sI.inspect} for user #{uName}"

    jS = JSON.generate(sI)
    return jS
  end
  
  run! 
end

