Architecture
Compare and contrast the types of frontend development you used in your full stack project, including Express HTML, JavaScript, and the single-page application (SPA).
Why did the backend use a NoSQL MongoDB database?

-So I used Express, HTML, Handlebars, Javascript for my user site and this type of front end development was made for server side rendering that had dynamic content generation. It was made for simpler multi page websites, this type though has limited interactions when compared 
to the SPA because every action needs a full page to reload.
The SPA (Single Page Application) was made using Angular so that I could deliver a dynamic and interactive user experience, this has client side rendering which made it much more responsive and faster than the other front end site. This also helps reduce server load because its 
logic is being handled on the client side and only uses the backend for data interaction. Express is easier to create for smaller projects, you would need strong SEO for the server-side rendering. The Angular SPA is great for complicated applications that are managing lots 
data because its really fast. The backend used a NoSQL MongoDB for its database because the schema-less strucutre of it is great for data that will be evolving, it is also very scalable when it comes to high demand. It is also easy to implement into a system because of the Mongoose ODM.
The Mongoose ODM helped define the schemas and the interactions with the database.

Functionality
How is JSON different from Javascript and how does JSON tie together the frontend and backend development pieces?
Provide instances in the full stack process when you refactored code to improve functionality and efficiencies, and name the benefits that come from reusable user interface (UI) components.

- JSON is different because it is data formatted to look like an object or array. Now Javascript is a programming language that allowed me to create functions to hanlde route changes and other complex functions. JSON is great though because it allows me to use it to exchange data
- between the backend and front end. JSON plays an important role for the front end / backend because it is the primary way I transfer data, an example is when a user logs in, I gather their credentials from the frontend then its sent to the backend so that I can locate their travel
- package details. I refactored the reservation service which let me simplify the API interactions, consolidating http requests was the better option to go for to reduce load. Another example is the tripCard component, this was used across other components which helps reduce code
- duplication. The benefits that come from reuseable UI are faster development, consistent design, and it is also easier to debug problems because issuses are divided instead of mixed together.

Testing
Methods for request and retrieval necessitate various types of API testing of endpoints, in addition to the difficulties of testing with added layers of security. Explain your understanding of methods, endpoints, and security in a full stack application.

- For my testing methods, I utilized many types of tools, I used Postman to test functions, I used Mongo Compass to see database changes or variable updates, I also used console.logs to see if I could catch specific changes during controller and routes pipelines. I also used
- my browsers dev tools to see realtime changes and insights. Postman helped with testing endpoints like GET, POST, PUT, and DELETE. Some difficulty I faced with Security layers are when I tested endpoints that are protected by JWT, this made me authenticate to make sure that data
- was accessable securely. Keeping track of API rate limits also created more complex situations. Methods will represent the HTTP actions such as GET to fetch data, POST to create data. Endpoints are the urls that give me data on specific things such as a users trip reservation details.
- Security is going to make sure that only an authorized user can access information that they should have, such as an admin being able to manage trips and a user only being able to make reservations on trips. I acheived this by using JWT's and role based access throughout my system.

Reflection
How has this course helped you in reaching your professional goals? What skills have you learned, developed, or mastered in this course to help you become a more marketable candidate in your career field?

- This course has increase my understanding of Full stack development especially with the technology stack of Mongo Express Angular and Node. This helped me also in my internship by allowing me to better understand API's and security and how data gets transferred. The skills I learned
- are mastering Angular for dynamic UI's and my skill in API design as well as backend development with Node and Express. The challenges I faced in this final project helped me refine my testing and debugging skills and my ability to refactor code in a way that is reusable. I am now
- a more marketable candidate because I understand the MEAN stack, I know how important secure application design is and how to execute the design for it, and my experience with creating reusable components to help my development process be more efficient.
