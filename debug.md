# Debug History of EduChain Explorer

### Issue \#1 1/29/23:
Can't connect peer to server on certain host
#### Error: 
connect ECONNREFUSED
#### Observation:
nothing is running on the port (5556) that I'm attempting to connect to
#### Solution: 
run server (hadn't saved package.json)

### Issue \#2 1/30/23:
POST request ignores condition in peers/connect API of Blockchain-Explorer project
#### Error: 
\[ERR_HTTP_HEADERS_SENT\]: Cannot set headers after they are sent to the client
#### Solution: 
Don't recursively make requests that make the same request again with the original request

### Issue \#3 2/2/23: 
formatTimestamp fn error in Blockchain-Explorer project
#### Uncaught TypeError: 
Cannot read properties of null (reading '1') at formatTimestamp (formatTimestamp.js:3:1)
#### Solution: 
timeStamp needs to be changed to timestamp in page renders

### Issue \#4 2/3/22:
Could not verify txs with Blockchain project
#### Solution: 
sign() parameters were mixed up, so the signatures were incorrect for txs

### Issue \#5 2/4/23: 
Axios is encountering error when sending request to backend node endpoint
#### AxiosError:
{message: 'Network Error', name: 'AxiosError'...}
#### Different Approach: 
use fetch instead of axios

### Issue \#6 2/5/23: 
Axios throws looooooooooooooonnnng error
#### Solution: 
use 'await' keyword before every axios request or use fetch (still use 'await,' but debugging is 
easier with fetch)