require_relative '../color/stringColor'
require 'chronic_duration'
require 'chronic'

module EventStatus
  ## these are the status
  Deleted = 0 
  Active = 1
  Inactive = 2

  def toString(s)
    return "Deleted" if s == 0
    return "Active" if s == 1
    return "Inactive" if s == 2
    return "Invalid Status"
  end
  module_function :toString
  
end

class Event
  attr_accessor :id, :creator, :event_name, :time, :duration, :location, :detail, :status
  # the creator is the user.id of the user create the event


  def initialize(id=nil)
    # input is event object id
    @id = id
  end

  def hashToEvent(h) #to make event objects after you get them from the database
    # the input is a event from eventDB
    # we assign the value to each variable in the event object
    @creator = h[:creator]
    @event_name = h[:event_name]
    @time = h[:time]
    @duration = h[:duration]
    @location = h[:location]
    @detail = h[:detail]
    @status = h[:status]
  end

  def stringToEvent(string)  # if you want to read events from a file
    # input is string
    puts "stringToEvent DEPRECATED"
    exit
    arr = string.split("|")
    # convert the string to array
    ## chomp and lstrip and rstrip
    @creator = arr[0]
    @time = arr[1]
    @location = arr[2]
    @detail = arr[3]
    @status = arr[4]
    # assign the value to each variable in the event object
  end
  
  def toString # to print them


    t = Time.at(@time).strftime("%c") if @time# make string out of the integer
    d = ChronicDuration.output(@duration, :limit_to_hours => true)

    s =  "EID:".red + "#{@id}"
    s +=  "\tcreator:".red + "#{@creator}"
    s += "\tname:".red + "#{@event_name}"
    s +=  "\ttime:".red + "#{t}"
    s +=  "\tduration:".red + "#{d}"
    s +=  "\tloc.:".red + "#{@location}"
    s += "\tdetail:".red + "#{@detail}"
    s += "\tstatus:".red + "#{EventStatus::toString(@status)}".blue
    return s
  end
  
  def dataToString # to print them
    t = Time.at(@time).strftime("%c") if @time
    d = ChronicDuration.output(@duration, :limit_to_hours => true)

#    s =  ""
    s =  "EID:".red + "#{@id}"
    s += "\tname:".red + "#{@event_name}"
    s +=  "\ttime:".red + "#{t}"
    s +=  "\tduration:".red + "#{d}"
    s +=  "\tloc.:".red + "#{@location}"
    s += "\tDetail:".red + "#{@detail}"
    s += "\tstatus:".red + "#{EventStatus::toString(@status)}".blue
    return s
  end

    def as_json(options={})
    {
#  attr_accessor :id, :creator, :time, :duration, :location, :detail, :status
      id: @id,
      creator: @creator,
      event_name: @event_name,
      time: @time,
      duration: @duration,
      location: @location,
      detail: @detail,
      status: @status
    }
  end

  def to_json(*options)
      as_json(*options).to_json(*options)
  end

  
end

class EventDB
  def initialize(db = nil)
    if !db
      @database = createEventDB()
    else
      @database = db       
    end
  end

  def createEventDB
    DB.create_table! :eventDB do
      primary_key :id
      Integer :creator
      String :event_name
      Integer :time
      Integer :duration
      String :location
      String :detail
      Integer :status
    end
    return DB[:eventDB]
  end
  
  def addEvent(event)
    # the input is event object
    # receive the user object and create an id for the user
    id = @database.insert(:creator => event.creator, 
                          :event_name => event.event_name,
                          :time => event.time, 
                          :duration => event.duration, 
                          :location => event.location, :detail => event.detail,
                          :status => event.status)
    # insert the event to eventdb
    return id
  end
  
  def all  ### do we need to validate if @database is empty
    # input none
    # output an array of event objects
    # what does this fun... to find all the events in events table 
    # ceate an empty events array
    eventArr = Array.new
    # and create new event object for each event in event table
    @database.each{|event|
      e  = Event.new(event[:id])
      e.hashToEvent(event)
      eventArr << e
    }
    # append each new event object to events array
    return eventArr
  end

  def findEventById(id)
    # input is an integer
    # output is an event object
    # find the event.id == id
    eventById = @database.where(:id => id)
    # if cannot find event.id == id
    if eventById.count == 0
      # return false => no such event
      return false
    # else create an event object
    else
      eventById.each{|eventHash|
        event = Event.new(eventHash[:id])
        event.hashToEvent(eventHash)
        return event
      }
    end
  end
    
  def byUser(uid) # bwe need to communicate with the user table
    # input user.id is an integer
    # output is an array of event objects
    # 
    # finds all events where event.user.id == creater.id
    # create an empty new array
    # create new event object for each event with the id
    # append each new event object to events array

    events = @database.where(:creator => uid)
    eA = Array.new          # create an event array

    events.each{|eH|
      # append the event object to event array
      e = Event.new(eH[:id])
      e.hashToEvent(eH)
      eA << e
    }
    # return the event object array
    return eA
  end
  
  def updateEvent(event)
    # input id is an integer
    # out put is an event object
    # 
    # what does this function to is to update an existing event
    # look for the event.id == id
    e = @database.where(:id => event.id)
    # create an event object
    if e.count == 0
      return false # no event found with the id
    else
      e.update(:id => event.id, :creator => event.creator,
              :event_name => event.event_name,
               :time => event.time, :duration => event.duration, 
               :location => event.location,
               :detail => event.detail, :status => event.status)
      # we pick the field( event.time, event.location, event.detail) to update
    end
  end
    
  def deleteEvent(id)
    event = findEventById(id)
    event.status = EventStatus::Deleted
    updateEvent(event)
  end
      
  def getEventsByLocation(location)
    # input is a string location
    # output is an array of event objects
    # what this function do is to get all the events in the same location
    # we look in the eventDB
    eventsArr = Array.new()
    events = @database.where(:location => location)
    # if we can find the event.location == location
    if events.count == 0
      return false # no event in the location
    # create a new event array
    else 
      # create new event object for each event
      # append each event to event array
      events.each{|event|
        e = Event.new(event[:id])
        e.hashToEvent(event)
        eventsArr << e
      }
      return eventsArr
    end
  end
  
  def byTime(st, et, uid=nil)
    # input time/date string of the event
    # output an event object array on the same time and date
    # the purpose of this function is to find all the events happen on the same day and time
    # we look for the event.time == time in the database
    events = @database.where{(time >= st) & (time <= et)}
    events = events.where(:creator => uid)  if uid
    
    eA = Array.new     

    events.each{|eH|
      # append the event object to event array
      e = Event.new(eH[:id])
      e.hashToEvent(eH)
      eA << e
    }
    # return the event object array
    return eA
  end

  def userByTime(uid, st, et)
    return byTime(st, et, uid)
  end
  
  def findEvents(uid, tSpec, lSpec, dSpec)
    # input  user id
    #        tSpec array of [st, et]
    #        lSpec string or null
    #        dSpec string or null

    # the purpose of this function if find all the events with the keyword
    # items.where(Sequel.join([:name, :comment], ':').like('John:%nice%')).sql

    events =  @database
    ##

    events = events.where(:creator => uid)  # start with all of THIS users events

    st = tSpec[0]
    et = tSpec[1]
    if ( st != 0) && (et !=0)
      events = events.where{(time >= st) & (time <= et)}  ## filter by time
    end

    events = events.where(Sequel.like(:location, "%#{lSpec}%"))  if lSpec # filter for  location
    events = events.where(Sequel.like(:detail, "%#{dSpec}%"))  if dSpec # filter for  detail


    eventArr = Array.new
    events.each{|event|
      e = Event.new
      e.hashToEvent(event)  ## does not fill in the id
      e.id = event[:id]
      eventArr << e
    }
    return eventArr
  end

  def eRawDB
    return @database
  end


end

    
