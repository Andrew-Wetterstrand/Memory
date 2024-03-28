import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Button, TouchableOpacity, Animated, ScrollView } from 'react-native';

export default function App() {
    const [showWelcomeModal, setShowWelcomeModal] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [moves, setMoves] = useState(0);
    const [difficultyModalVisible, setDifficultyModalVisible] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState('Easy');
    const [showPopup, setShowPopup] = useState(false); // Added state for congratulatory popup
    const [score, setScore] = useState(0); // Added state for score

    const checkGameCompletion = () => {
        // Check if all matches have been found
        const allCardsFlipped = cards.every(card => card.flipped);
        if (allCardsFlipped) {
            setShowPopup(true);
        }

        // Check if there are remaining moves
        if (moves <= 0) {
            // Implement your logic to handle "Game Over" message
            // For example, you can set a state to display the message
            // You need to replace this logic with your actual "Game Over" handling
            console.log('Game Over'); // Placeholder logic, replace with actual "Game Over" handling
        }
    };
    useEffect(() => {
        if (flippedCards.length === 2) {
            handleCardMatch();
        }
    }, [flippedCards]);

    const handleCloseWelcomeModal = () => {
        setShowWelcomeModal(false);
    };

    const handleStartGame = () => {
        setGameStarted(true);
        // Generate cards
        const totalCards = 16; // 4x4 grid
        const cardValues = Array.from({ length: totalCards / 2 }, (_, index) => index + 1);
        const shuffledCards = shuffleArray([...cardValues, ...cardValues]);
        setCards(shuffledCards.map((value, index) => ({ id: index, value: value, flipped: false })));
    };

    const handleCardPress = (card) => {
        if (!card.flipped) {
            flipCard(card);
            setFlippedCards([...flippedCards, card]);
        }
    };

    const flipCard = (card) => {
        setCards((prevCards) =>
            prevCards.map((prevCard) =>
                prevCard.id === card.id ? { ...prevCard, flipped: !prevCard.flipped } : prevCard
            )
        );
    };

    const handleCardMatch = () => {
        const [card1, card2] = flippedCards;
        if (card1.value === card2.value) {
            // Cards match
            setCards((prevCards) =>
                prevCards.map((prevCard) =>
                    prevCard.id === card1.id || prevCard.id === card2.id
                        ? { ...prevCard, flipped: true }
                        : prevCard
                )
            );
            setFlippedCards([]);
            // Increment the score by a random number between 1 and 20
            const randomIncrement = Math.floor(Math.random() * 20) + 1;
            setScore(score + randomIncrement);
        } else {
            // Cards don't match, flip them back after a delay and decrement moves counter
            setTimeout(() => {
                flipCard(card1);
                flipCard(card2);
                setFlippedCards([]);
                setMoves((moves) => moves - 1); // Decrement moves counter
            }, 1000);
        }
    };



    const handleResetGame = () => {
        setGameStarted(false);
        setCards([]);
        setFlippedCards([]);
        setMoves(0);
    };

    const handleSelectDifficulty = () => {
        setDifficultyModalVisible(true);
    };

    const handleDifficultyChange = (difficulty) => {
        // You can adjust the moves and totalCards based on the selected difficulty
        switch (difficulty) {
            case 'Easy':
                setMoves(15);
                setCards([]); // Reset cards
                break;
            case 'Medium':
                setMoves(10);
                setCards([]); // Reset cards
                break;
            case 'Hard':
                setMoves(5);
                setCards([]); // Reset cards
                break;
            // Add more difficulty levels if needed
            default:
                break;
        }
        setSelectedDifficulty(difficulty);
        setDifficultyModalVisible(false);
    };

    const renderCard = (card) => {
        return (
            <TouchableOpacity key={card.id} onPress={() => handleCardPress(card)}>
                <Animated.View
                    style={[
                        styles.cardContainer,
                        { backgroundColor: card.flipped ? getColorForValue(card.value) : '#DDDDDD' },
                    ]}
                >
                    <Text style={styles.cardText}>{card.flipped ? card.value : 'X'}</Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showWelcomeModal}
                onRequestClose={handleCloseWelcomeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.text}>Welcome!</Text>
                        <Button title="Close" onPress={handleCloseWelcomeModal} />
                    </View>
                </View>
            </Modal>

            {gameStarted && (
                <View style={styles.gameContainer}>
                    <ScrollView contentContainerStyle={styles.cardGrid}>
                        {cards.map((card) => renderCard(card))}
                    </ScrollView>
                    <Text style={styles.movesText}>Moves: {moves}</Text>
                    <TouchableOpacity style={styles.resetButton} onPress={handleResetGame}>
                        <Text style={styles.resetButtonText}>Reset Game</Text>
                    </TouchableOpacity>
                </View>
            )}

            {!gameStarted && (
                <View style={styles.startContainer}>
                    <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
                        <Text style={styles.startButtonText}>Start Playing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.difficultyButton} onPress={handleSelectDifficulty}>
                        <Text style={styles.difficultyButtonText}>Select Difficulty</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={difficultyModalVisible}
                onRequestClose={() => setDifficultyModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.text}>Select Difficulty</Text>
                        <TouchableOpacity
                            style={styles.difficultyOption}
                            onPress={() => handleDifficultyChange('Easy')}
                        >
                            <Text style={styles.optionText}>Easy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.difficultyOption}
                            onPress={() => handleDifficultyChange('Medium')}
                        >
                            <Text style={styles.optionText}>Medium</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.difficultyOption}
                            onPress={() => handleDifficultyChange('Hard')}
                        >
                            <Text style={styles.optionText}>Hard</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    gameContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%', // Adjust as needed to control the width of the grid
        marginTop: 250, // Adjust margin top as needed
        maxWidth: 400, // Set a maximum width for the grid to ensure it doesn't exceed the screen width
    },
    cardContainer: {
        width: 50, // Set a fixed width for each card
        height: 50, // Set a fixed height for each card
        margin: 5, // Adjust margin to create space between cards
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    cardText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    movesText: {
        fontSize: 18,
    },
    resetButton: {
        backgroundColor: '#FF6347', // Tomato color
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 20,
    },
    resetButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    startContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: '#007AFF', // Apple blue color
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: 20,
    },
    startButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    difficultyButton: {
        backgroundColor: '#6B8E23', // Olive Drab color
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    difficultyButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    difficultyOption: {
        backgroundColor: '#DDDDDD',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: 10,
    },
    optionText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

// Helper function to shuffle an array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Helper function to get color based on card value
const getColorForValue = (value) => {
    switch (value) {
        case 1:
            return '#FF5733'; // Orange
        case 2:
            return '#33FF57'; // Green
        case 3:
            return '#5733FF'; // Blue
        case 4:
            return '#FF33E8'; // Pink
        case 5:
            return '#FFFF00'; // Yellow
        case 6:
            return '#FF69B4'; // Bright pink
        case 7:
            return '#00FFFF'; // Cyan
        case 8:
            return '#FFA500'; // Orange (alternate)
        default:
            return '#DDDDDD'; // Default color
    }
};