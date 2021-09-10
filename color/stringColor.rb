## we will put  this somewhere else later but for now,
## it is here.. please ignore this code.

class String
  # colorization
  def colorize(color_code)
    "\e[#{color_code}m#{self}\e[0m"
  end
  def rgb(red, green, blue)
    16 + (red * 36) + (green * 6) + blue
  end

  def gray(g)
    232 + g
  end

  def set_color(fg)
    return "\x1b[38;5;#{fg}m" if fg
    #    print "\x1b[48;5;#{bg}m" if bg
  end

  def reset_color
    return "\x1b[0m"
  end

  def outputColor(r,g,b)
    return "#{set_color(rgb(r,g,b))}#{self}#{reset_color}"
  end
  
  def red
    return outputColor(5,0,0) ## pure red
  end

  def darkGrey
    return outputColor(1,1,1) 
  end

  def green
    return outputColor(0,5,0)
  end

  def yellow
    return outputColor(5,5,0)
  end

  def blue
    return outputColor(0,0,5)
  end

  def pink
    return outputColor(3,0,1)
  end

  def light_blue
    return outputColor(1,1,3)

  end
  
  def bright_red()
    outputColor(5,0,0)
  end
  def red()
    outputColor(4,0,0)
  end

  def orange
    outputColor(5,1,0)
  end

  def acid_green
    outputColor(0,5,0)
  end

  def green
    outputColor(1,4,1)
  end
  def dark_green
    outputColor(0,2,0)
  end

  def bright_yellow
    outputColor(5,5,0)
  end

  def yellow
    outputColor(5,4,0)
  end

  def light_blue
    outputColor(2,2,4)
  end

  def grey_green
    outputColor(2,3,3)
  end

  def blue
    outputColor(0,0,5)
  end

  def black
    outputColor(0,0,0)
  end

  def dark_grey
    outputColor(1,1,1)
  end
  def light_grey
    outputColor(4,4,4)
  end

end

