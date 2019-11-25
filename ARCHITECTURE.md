# ARCHITECTURE

1. architectural choices

    I choose to use serverless lambda function to implement this solution as this solution will be platform independent which means you could move your infrastructure from AWS to Google Cloud just by changing the settings and this choice could allow high resilience to switch services and deploy by scale

2. constraints of the solution provided
   
    This solution constraints are based on cloud and API gateway implemented in each cloud provider. There will be timeout limit and payload size limit in the API like AWS for example will be limited to 30 seconds in HTTP API request, even the actual running time is longer than the timeout but it has limitation on user end to actually get the result from the API calls.

3. resiliency to data loss in any event and approaches that can minimize/prevent it
   
    The fallback from one services to another services provider for email sending could not cover the data loss, if both or all service provider went down or offline, then we need to implement a queue system like AWS SQS to stack the request and saving the data there once when email service provider back online, then it is possible to proccess the queue and the data will be recovered.

4. possible solutions/ideas to add auditing capabilities to the system (when / what to log)
   
   There will be cloudwatch by default log all the lambda function logs, and we will be able to see logs from cloudwatch. In the meantime, there will be good idea to streaming the log to elasticsearch or other log searchable services to provide additional debugging and trouble shoot.