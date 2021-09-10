class User
  attr_accessor :id, :name, :email, :location, :password
  def initialize(id=nil)
      @id = id
  end

  def hashToUser(h)
    @name = h[:name]
    @email = h[:email]
    @location = h[:location]
    @password = h[:password]
  end

  def populate(n, e, l, p)
    @name = n
    @email = e
    @location = l
    @password = p
  end

  def userToString
    return "id: #{@id}\tname: [#{@name}]\temail: [#{@email}]\tloc:[#{@location}]\tpasswd:[#{@password}]"   
  end
  
  def stringPopulate(string)
    # take in a string
    arr = string.split("|")
     @name = arr[0].chomp.lstrip.rstrip
     @email = arr[1].chomp.lstrip.rstrip
     @password = arr[2].chomp.lstrip.rstrip
     @location = arr[3].chomp.lstrip.rstrip
  end

  def as_json(options={})
    {
#        attr_accessor :id, :name, :email, :location, :password
      id: @id,
      name: @name,
      email: @email,
      location: @location,
      password: @password
    }
  end

  def to_json(*options)
      as_json(*options).to_json(*options)
  end


end

class UserDB
  attr_writer :database

  def initialize(db=nil) 
    @lastID = 1
    if !db
      @database = create()  # to create the table
    else
      @database = db
      @lastID = @database.count
    end
  end

  def create
    DB.create_table! :userDB do   ## create a whole new table
      Integer :id  # primary_key fuckup
      String :name
      String :email
      String :location
      String :password
    end
    return DB[:userDB]
  end


  def newUser(user)
    ## check to make sure all fields  are present otherwise complain

    ## make sure name is unique
    u = getUserByName(user.name)
    if u
      print "Dupliciate ADD!!  user #{u.name} with id  #{u.id} is already in database\n"
      return nil
    end
    
    ## make sure id is unique
    if user.id  == nil
      user.id = @lastID
      @lastID +=1
      ## make sure id is unique 
    end
    # if (!getUserById(user.id))
    #   return
    # end

    @database.insert(:id => user.id, :name => user.name,
                     :email => user.email, :location => user.location,
                     :password => user.password)
    return user.id
  end

  def getUserByName(n)
    users =  @database.where(:name => n)
    return nil if users.count == 0
    users.each{|u|
      user = User.new(u[:id])
      user.hashToUser(u)
      return user  ## returns only 1....
    }
  end

  def getUserById(id)
    ## return a new User structure with that user
    users =  @database.where(:id => id)
    return nil if users.count == 0
    users.each{|u|
      user = User.new(u[:id])
      user.hashToUser(u)
      return user  ## returns only 1....
    }
  end

  def getUsersByFilter(f)
    uA = Array.new
    if $currentUser.name != "god"
      puts "You are not god user"
    end

    users = @database.where(Sequel.like(name, "%#{f}%")) if f
    users.each{|u|
    user = User.new
    user.hashToUser(u)
    user.id = u[:id]
    uA << user
    }
    puts uA
    return uA
  end


  def getUsersByLocation(l)
    # return an ARRAY of User.new
    users =  @database.where(:location => l)
    return nil if users.count == 0
    uArray = Array.new 
    users.each{|u|
      user = User.new(u[:id])
      user.hashToUser(u)
      uArray << user
    }
    return uArray
  end

  def getAllUsers
    # return an ARRAY of User.new
    users =  @database.all
    return nil if users.count == 0
    uArray = Array.new 
    users.each{|u|
      user = User.new(u[:id])
      user.hashToUser(u)
      uArray << user
    }
    return uArray
  end
  
  def count
    return @database.count
  end

  def update(user) # user object for row to update
    x = @database.where(:id => user.id)  ## find this user
    x.update(:email => user.email, :location => user.location, :password => user.password)
    ## update their information
  end

  def rawDB
    return @database
  end

  def verifyLogin(name, pwd)
      g = getUserByName(name)
    return false if !g
    return g.password == pwd
  end


end
