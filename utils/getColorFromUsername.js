function getColorFromUsername(username) {
    // Simple hash function to convert username to a number
    const hashCode = Array.from(username).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
    // Array of light colors
    const lightColors = [
      '#ADD8E6', // Light Blue
      '#90EE90', // Light Green
      '#F08080', // Light Coral
      '#FFFFE0', // Light Yellow
      '#FFB6C1', // Light Pink
      '#E6E6FA', // Lavender
      '#FAFAD2', // Light Goldenrod Yellow
      '#AFEEEE', // Pale Turquoise
      '#FFDAB9', // Peach Puff
      '#FFE4E1', // Misty Rose
    ];
  
    // Select a color based on the hash code
    return lightColors[hashCode % lightColors.length];
  }

  export default getColorFromUsername;