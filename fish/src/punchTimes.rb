
#             {key: 2, text:"30 mins", value:"30 mins"},
i=0
24.times{ |h|
  4.times {|m|
    time = "#{ "%02d" %   h}:#{ "%02d" % (m*15)}"
    puts "{key: #{i}, text:\"#{time}\" , value: \"#{time}\"},"
    i+=1
  }
}
