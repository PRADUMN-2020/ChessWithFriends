# ![image](https://github.com/PRADUMN-2020/ChessWithFriends/assets/62955903/9880d43f-de15-48b7-9d81-10573e1e085d) ChessWithFriends
A chess game to play chess with friends while having a video chat.

## Description

🎉 Are you ready to embark on an epic chess journey with your friends, no matter where they are in the world? Introducing ChessWithFriends, the ultimate web app that brings the magic of chess right to your fingertips, turning distances into mere illusions!🌎🌟

🎮 Play Across Borders: Break free from geographical barriers and challenge your friends to thrilling chess battles! Whether they're across the street or across the globe, you can connect and enjoy the age-old game like never before.🌐♟️

🤝 Real-time Video Chat: Get the authentic feel of a face-to-face match with our built-in video chat feature! Strategize, tease, and celebrate your victories together, just like you're in the same room!🎙️📹

🏆 Challenge the World: Step into the Arena of Kings and test your skills against players from every corner of the earth. Rise through the ranks, earn trophies, and become a legendary chess master!🏅🤴

This app aims to lets people enjoy the game of chess regardless of any geographical location across the world. It also has a feature to have a video chat while playing chess with your friends.

### Features🛠️

- Feature 1: Real time video chat.🎥👥
- Feature 2: Fully Responsive across all websites.📱💻
- Feature 3: Seperate Game Rooms to for multiple games simultaneously.🏰👥
- Feature 4: 10 Min chess timer, fully synchronysed at both clients and server.⏱️🔄
- Feature 5: Robust architecture to handle disconnections and preserve game state.🏗️💾
- Feature 6: Reload on disconnection to restore the gamestate and resume playing.🔄🔄
- Feature 7: Restarts video chat on each reload.🎥🔄
- Feature 8: Game ends if someone leaves in 30 secs.🕒👋
- Feature 9: Simply click on Generate Game url and share with friend, Game starts for both when the friend joins.📨👫
- Feature 10: If someone accidently closes the tab press "ctrl+shit+t" to reconnect and restore the game state and continue 
              playing(within 30 secs.)🔄🔄🔁


## Screenshots📸

1. Initial Page Desktop view:
   <p alight="centre">
   <img src="https://github.com/PRADUMN-2020/ChessWithFriends/blob/main/client/public/assets/pieces/initial-page-pc.png" width="350" title="hover text">
   </p>
2. Initial Page Mobile view:
   <p alight="centre">
   <img src="client/public/assets/pieces/initial-page-mobile.png" width="350" title="hover text">
  </p>
   
5. Game Room Desktop view:
   ![Desktop View](client/public/assets/pieces/initial-page-pc.png)

6.  Game Room Mobile View:
   ![Mobile View](client/public/assets/pieces/initial-page-pc.png)

## Deployment🚀

The web application is deployed and accessible, Check the live link here [Deployment Link](https://chesswithfriends.vercel.app/).

## Technologies Used🧰

- [React](https://legacy.reactjs.org/): React was used for the frontend of this project.
  
- [Node](https://nodejs.org/en/about): Node, Express was used for the bakend of the project.
  
- [WebSocket](https://socket.io/): WebSockets(socket.io) was used to communicate the game moves from clients to the server and to keep 
   both clients in a room along with the server in sync, also used for the signalling of the peers to initiate the video chat between 
   them and also to restart the video chat once someone reloads.
  
- [WEBRTC](https://github.com/feross/simple-peer): WEBRTC(simple-peer) was used to handle the peer connection between the 2 players in a room, to start video 
  chat between them and do all the signalling and streaming logic.
  
- [Bootstrap and Material UI]: Bootstrap was basically used for providing responsivess and MUI for styling along with some custom CSS.

## Contact📞

If you want to hire me, have any questions or just want to get in touch, feel free to reach out:

- Email: pradumnprasad883@gmail.com
- LinkedIn: [My LinkedIn Profile](https://www.linkedin.com/in/pradumn-prasad/)
- Twitter: [My Twitter Profile](https://twitter.com/PradumnPrasad7)

Happy coding!🚀👨‍💻
