// import React, { useEffect, useRef } from 'react';
// import Phaser from 'phaser';
// import { useParams } from 'react-router-dom';
// import OfficeScene from './OfficeScene'; // Phaser scene

// const PhaserGame = () => {
//     const gameRef = useRef(null);
//     const {spaceId} = useParams();//to get the space id
//     useEffect(() => {
//         if (!gameRef.current) {
//             gameRef.current = new Phaser.Game({
//                 type: Phaser.AUTO,
//                 width: window.innerWidth,
//                 height: window.innerHeight,
//                 backgroundColor: '#B98D72',
//                 parent: 'phaser-container',
//                 physics: {
//                     default: 'arcade',
//                     arcade: {
//                         gravity: { y: 0 },
//                         debug: false
//                     }
//                 },
//                 scene: [OfficeScene]
//             });
//         }

//         return () => {
//             if (gameRef.current) {
//                 gameRef.current.destroy(true);
//                 gameRef.current = null;
//             }
//             console.log(spaceId);
            
//         };
//     }, [spaceId]);

//     return <div id="phaser-container"></div>;
// };

// export default PhaserGame;
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import OfficeScene from './OfficeScene';

const socket = io("http://localhost:3000", { withCredentials: true });

const PhaserGame = () => {
    const gameRef = useRef(null);
    const { spaceId } = useParams();
    const userId = localStorage.getItem("userId") || "1";

    useEffect(() => {
        if (!gameRef.current) {
            gameRef.current = new Phaser.Game({
                type: Phaser.AUTO,
                width: window.innerWidth,
                height: window.innerHeight,
                backgroundColor: '#B98D72',
                parent: 'phaser-container',
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 0 },
                        debug: false
                    }
                },
                scene: [new OfficeScene(socket, spaceId, userId)]
            });
        }

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
            socket.disconnect();
            console.log("Disconnected from space:", spaceId);
        };
    }, [spaceId, userId]);

    return <div id="phaser-container"></div>;
};

export default PhaserGame;
