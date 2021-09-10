import axios from 'axios'


class BabyServer {

async send(URL, uData){
    const resp = await axios.post(URL, uData)
          .catch(err => {
	      console.log(err)
	      console.log('here in error handler')
	      return null
	  })

    if (resp){
	return resp.data
    }
    return null
    
}
    async post(URL, uData){
	var ret = await this.send(URL, uData)
	return ret
    }
    
}

export const bS = new BabyServer()



