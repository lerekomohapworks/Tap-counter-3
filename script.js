html, body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #f2f2f2;

  /* 🔒 Prevent zoom and gestures */
  touch-action: none;
  -ms-touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  overflow-x: hidden;
}

.container {
  text-align: center;
  margin-top: 50px;
}

#tapArea {
  background-color: #fff;
  padding: 60px;
  margin: 30px;
  border: 2px dashed #333;
  border-radius: 10px;
  cursor: pointer;

  /* Make sure zoom doesn't trigger */
  touch-action: manipulation;
}

.counters {
  font-size: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

label {
  font-size: 18px;
}

input[type="number"] {
  font-size: 18px; /* 🔐 must be 16px+ to prevent iOS zoom */
  width: 80px;
  padding: 5px;
  margin-left: 10px;
  text-align: center;

  /* Prevent zoom on focus */
  touch-action: manipulation;
}
