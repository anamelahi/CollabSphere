import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import OfficeScene from './OfficeScene'; // Phaser scene

const PhaserGame = () => {
    const gameRef = useRef(null);

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
                scene: [OfficeScene]
            });
        }

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);

    return <div id="phaser-container"></div>;
};

export default PhaserGame;
