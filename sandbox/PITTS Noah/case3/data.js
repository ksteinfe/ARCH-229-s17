

// monthlyDryBulb (12 values)
var monthlyDryBulb = [
    { mean: -3.6469, mode: 1.0, q4: 6.0, q3: -1.0, q2: -3.0, q1: -6.0, q0: -17.0 },
    { mean: -6.2699, mode: -7.0, q4: 8.0, q3: -2.0, q2: -7.0, q1: -10.0, q0: -19.0 },
    { mean: 5.347, mode: 2.0, q4: 26.0, q3: 10.0, q2: 5.0, q1: 0.0, q0: -7.0 },
    { mean: 10.0508, mode: 2.2, q4: 27.2, q3: 15.6, q2: 9.4, q1: 4.725, q0: -4.9 },
    { mean: 12.8831, mode: 12.0, q4: 24.0, q3: 16.0, q2: 13.0, q1: 9.0, q0: 2.0 },
    { mean: 21.1726, mode: 19.4, q4: 33.2, q3: 24.4, q2: 20.5, q1: 18.1, q0: 8.5 },
    { mean: 23.102, mode: 22.8, q4: 35.0, q3: 26.7, q2: 22.9, q1: 19.175, q0: 12.8 },
    { mean: 22.5401, mode: 19.0, q4: 36.0, q3: 26.0, q2: 22.0, q1: 19.0, q0: 11.0 },
    { mean: 18.8322, mode: 17.0, q4: 29.0, q3: 23.0, q2: 19.0, q1: 15.0, q0: 4.0 },
    { mean: 10.5843, mode: 10.0, q4: 28.0, q3: 13.6, q2: 10.0, q1: 7.0, q0: 0.0 },
    { mean: 7.9176, mode: 4.0, q4: 19.0, q3: 12.0, q2: 7.0, q1: 4.0, q0: -2.0 },
    { mean: -0.8938, mode: 0.0, q4: 8.0, q3: 1.0, q2: -0.5, q1: -2.0, q0: -15.0 }
];

// monthlyRelHumid (12 values)
var monthlyRelHumid = [
    { mean: 79.6183, mode: 77.0, q4: 100.0, q3: 86.0, q2: 78.0, q1: 71.0, q0: 42.0 }, { mean: 70.8899, mode: 92.0, q4: 100.0, q3: 84.0, q2: 71.0, q1: 59.0, q0: 20.0 }, { mean: 66.6075, mode: 100.0, q4: 100.0, q3: 84.0, q2: 66.0, q1: 52.0, q0: 24.0 }, { mean: 69.1292, mode: 93.0, q4: 100.0, q3: 87.0, q2: 71.0, q1: 54.0, q0: 26.0 }, { mean: 73.6626, mode: 94.0, q4: 100.0, q3: 88.0, q2: 77.0, q1: 60.0, q0: 21.0 }, { mean: 76.2236, mode: 100.0, q4: 100.0, q3: 93.0, q2: 79.0, q1: 62.0, q0: 31.0 }, { mean: 69.0995, mode: 93.0, q4: 100.0, q3: 85.0, q2: 70.0, q1: 53.0, q0: 32.0 }, { mean: 69.0605, mode: 94.0, q4: 100.0, q3: 88.0, q2: 72.0, q1: 54.0, q0: 26.0 }, { mean: 71.7181, mode: 94.0, q4: 100.0, q3: 88.0, q2: 73.0, q1: 56.25, q0: 28.0 }, { mean: 78.0175, mode: 87.0, q4: 100.0, q3: 92.0, q2: 80.0, q1: 67.0, q0: 29.0 }, { mean: 72.3861, mode: 100.0, q4: 100.0, q3: 87.0, q2: 73.0, q1: 59.0, q0: 26.0 }, { mean: 78.879, mode: 92.0, q4: 100.0, q3: 90.0, q2: 79.0, q1: 71.0, q0: 41.0 }
];

var dObj = [monthlyDryBulb, monthlyRelHumid];

// weeklyDryBulb (52 values)
var weeklyDryBulb = [
    { mean: -5.4083, mode: -2.0, q4: 2.0, q3: -2.0, q2: -4.5, q1: -8.0, q0: -17.0 }, { mean: -3.0917, mode: -1.0, q4: 4.0, q3: 0.0, q2: -1.0, q1: -5.0, q0: -17.0 }, { mean: -3.5565, mode: 1.0, q4: 3.0, q3: 0.75, q2: -3.0, q1: -6.0, q0: -13.0 }, { mean: -4.294, mode: -3.0, q4: 1.0, q3: -3.0, q2: -4.0, q1: -6.0, q0: -9.0 }, { mean: -0.1571, mode: 1.0, q4: 8.0, q3: 1.0, q2: 0.05, q1: -1.0, q0: -10.0 }, { mean: -8.0982, mode: -7.0, q4: -1.0, q3: -6.0, q2: -7.15, q1: -10.45, q0: -19.0 }, { mean: -8.7804, mode: -2.0, q4: -1.8, q3: -6.0, q2: -9.0, q1: -12.0, q0: -16.0 }, { mean: -4.247, mode: -9.0, q4: 8.0, q3: 0.0, q2: -4.0, q1: -9.0, q0: -17.0 }, { mean: -1.7411, mode: -1.0, q4: 13.0, q3: 3.825, q2: -1.0, q1: -7.0, q0: -18.0 }, { mean: 6.7839, mode: -3.0, q4: 26.0, q3: 14.0, q2: 6.0, q1: -2.0, q0: -7.0 }, { mean: 1.5238, mode: -1.0, q4: 16.0, q3: 4.75, q2: 0.0, q1: -2.0, q0: -6.0 }, { mean: 7.9601, mode: 6.0, q4: 19.0, q3: 12.0, q2: 7.0, q1: 4.0, q0: -1.0 }, { mean: 5.8048, mode: 7.0, q4: 14.0, q3: 9.0, q2: 6.0, q1: 2.0, q0: -2.1 }, { mean: 12.969, mode: 18.9, q4: 27.2, q3: 18.9, q2: 14.2, q1: 6.25, q0: -4.9 }, { mean: 7.072, mode: 6.1, q4: 19.4, q3: 9.4, q2: 6.7, q1: 4.4, q0: -3.2 }, { mean: 6.3208, mode: 2.2, q4: 14.4, q3: 8.75, q2: 6.0, q1: 2.8, q0: 0.6 }, { mean: 13.9518, mode: 13.3, q4: 23.3, q3: 18.175, q2: 13.7, q1: 10.525, q0: 2.2 }, { mean: 12.6923, mode: 12.0, q4: 21.0, q3: 16.575, q2: 13.0, q1: 10.0, q0: 2.0 }, { mean: 12.5982, mode: 8.0, q4: 24.0, q3: 16.0, q2: 11.0, q1: 9.0, q0: 6.0 }, { mean: 14.3726, mode: 12.0, q4: 22.0, q3: 17.975, q2: 14.0, q1: 12.0, q0: 6.0 }, { mean: 11.4655, mode: 8.0, q4: 19.0, q3: 14.975, q2: 12.0, q1: 8.0, q0: 3.0 }, { mean: 16.6589, mode: 14.0, q4: 26.6, q3: 20.875, q2: 17.2, q1: 12.0, q0: 7.0 }, { mean: 18.4857, mode: 16.6, q4: 27.2, q3: 20.0, q2: 18.35, q1: 16.6, q0: 10.0 }, { mean: 22.0065, mode: 19.4, q4: 30.5, q3: 25.5, q2: 20.7, q1: 18.55, q0: 14.4 }, { mean: 21.4839, mode: 24.4, q4: 27.7, q3: 24.4, q2: 21.1, q1: 19.15, q0: 11.1 }, { mean: 23.6315, mode: 26.6, q4: 33.2, q3: 27.35, q2: 23.55, q1: 20.0, q0: 11.6 }, { mean: 24.8821, mode: 28.3, q4: 33.3, q3: 28.3, q2: 25.0, q1: 20.6, q0: 17.2 }, { mean: 21.9446, mode: 17.8, q4: 34.4, q3: 25.6, q2: 21.7, q1: 18.825, q0: 12.8 }, { mean: 26.5256, mode: 24.4, q4: 35.0, q3: 30.0, q2: 26.25, q1: 23.3, q0: 16.7 }, { mean: 20.0381, mode: 23.3, q4: 27.2, q3: 23.3, q2: 19.4, q1: 16.7, q0: 12.8 }, { mean: 24.1292, mode: 23.0, q4: 33.0, q3: 28.0, q2: 24.0, q1: 21.0, q0: 12.8 }, { mean: 25.7911, mode: 26.0, q4: 36.0, q3: 29.0, q2: 26.0, q1: 22.0, q0: 15.9 }, { mean: 19.8155, mode: 19.0, q4: 27.0, q3: 22.0, q2: 19.0, q1: 17.125, q0: 11.0 }, { mean: 20.5732, mode: 19.0, q4: 28.0, q3: 23.0, q2: 20.0, q1: 18.0, q0: 14.0 }, { mean: 21.2726, mode: 24.0, q4: 29.0, q3: 24.0, q2: 22.0, q1: 18.0, q0: 12.0 }, { mean: 21.0274, mode: 21.0, q4: 28.0, q3: 24.0, q2: 21.0, q1: 18.0, q0: 12.0 }, { mean: 21.122, mode: 23.0, q4: 28.0, q3: 24.0, q2: 22.0, q1: 18.25, q0: 10.0 }, { mean: 16.9577, mode: 12.0, q4: 29.0, q3: 21.75, q2: 16.0, q1: 12.0, q0: 8.0 }, { mean: 15.6702, mode: 17.0, q4: 27.0, q3: 19.0, q2: 16.0, q1: 12.0, q0: 4.0 }, { mean: 12.7506, mode: 10.0, q4: 25.0, q3: 18.0, q2: 12.15, q1: 9.0, q0: 1.0 }, { mean: 9.7821, mode: 8.0, q4: 23.0, q3: 12.3, q2: 8.0, q1: 6.9, q0: 0.0 }, { mean: 10.7708, mode: 10.0, q4: 28.0, q3: 13.0, q2: 10.6, q1: 7.65, q0: 3.0 }, { mean: 10.9244, mode: 10.0, q4: 21.0, q3: 13.85, q2: 11.0, q1: 8.0, q0: 2.8 }, { mean: 9.019, mode: 12.0, q4: 18.0, q3: 13.0, q2: 9.15, q1: 4.075, q0: 0.0 }, { mean: 6.7048, mode: 4.0, q4: 16.0, q3: 11.0, q2: 6.0, q1: 3.0, q0: -1.0 }, { mean: 9.5917, mode: 12.0, q4: 19.0, q3: 13.0, q2: 11.0, q1: 6.0, q0: -2.0 }, { mean: 6.9315, mode: 1.0, q4: 16.0, q3: 11.0, q2: 7.0, q1: 3.0, q0: -1.0 }, { mean: 4.319, mode: 6.0, q4: 13.0, q3: 6.0, q2: 5.0, q1: 1.2, q0: -4.0 }, { mean: 0.2274, mode: 0.0, q4: 3.0, q3: 1.0, q2: 0.0, q1: -0.975, q0: -3.3 }, { mean: -0.7238, mode: -3.0, q4: 8.0, q3: 0.1, q2: -1.0, q1: -3.0, q0: -7.0 }, { mean: 0.1554, mode: 0.0, q4: 7.0, q3: 1.9, q2: 0.0, q1: -2.0, q0: -5.0 }, { mean: -2.0524, mode: 0.0, q4: 1.0, q3: 0.0, q2: -1.2, q1: -3.0, q0: -10.0 }
];

// weeklyRelHumid (52 values)
var weeklyRelHumid = [
    { mean: 78.2917, mode: 84.0, q4: 92.0, q3: 84.75, q2: 79.0, q1: 71.0, q0: 58.0 }, { mean: 80.6488, mode: 92.0, q4: 100.0, q3: 92.0, q2: 84.0, q1: 71.0, q0: 42.0 }, { mean: 80.0952, mode: 84.0, q4: 100.0, q3: 86.0, q2: 81.0, q1: 77.0, q0: 53.0 }, { mean: 75.9167, mode: 77.0, q4: 93.0, q3: 78.0, q2: 77.0, q1: 71.0, q0: 58.0 }, { mean: 87.6667, mode: 100.0, q4: 100.0, q3: 93.0, q2: 92.0, q1: 81.25, q0: 61.0 }, { mean: 69.3929, mode: 84.0, q4: 100.0, q3: 77.0, q2: 70.0, q1: 60.0, q0: 37.0 }, { mean: 70.4524, mode: 70.0, q4: 100.0, q3: 84.0, q2: 70.0, q1: 59.0, q0: 29.0 }, { mean: 69.0, mode: 92.0, q4: 92.0, q3: 84.0, q2: 71.0, q1: 57.0, q0: 31.0 }, { mean: 58.4762, mode: 71.0, q4: 92.0, q3: 71.0, q2: 60.0, q1: 45.0, q0: 20.0 }, { mean: 64.4643, mode: 71.0, q4: 100.0, q3: 77.0, q2: 67.0, q1: 51.0, q0: 26.0 }, { mean: 66.2083, mode: 100.0, q4: 100.0, q3: 86.5, q2: 61.0, q1: 51.0, q0: 27.0 }, { mean: 81.3452, mode: 100.0, q4: 100.0, q3: 100.0, q2: 87.5, q1: 67.0, q0: 28.0 }, { mean: 59.6131, mode: 36.0, q4: 100.0, q3: 72.0, q2: 61.0, q1: 45.25, q0: 24.0 }, { mean: 63.0952, mode: 81.0, q4: 100.0, q3: 81.0, q2: 66.5, q1: 41.25, q0: 26.0 }, { mean: 69.2262, mode: 100.0, q4: 100.0, q3: 89.75, q2: 68.0, q1: 54.0, q0: 28.0 }, { mean: 73.631, mode: 92.0, q4: 100.0, q3: 92.0, q2: 76.0, q1: 58.0, q0: 27.0 }, { mean: 72.9702, mode: 93.0, q4: 100.0, q3: 87.0, q2: 73.0, q1: 60.25, q0: 36.0 }, { mean: 66.7619, mode: 94.0, q4: 100.0, q3: 82.0, q2: 68.0, q1: 50.25, q0: 30.0 }, { mean: 75.2917, mode: 87.0, q4: 100.0, q3: 88.0, q2: 81.0, q1: 67.0, q0: 21.0 }, { mean: 75.119, mode: 94.0, q4: 100.0, q3: 88.0, q2: 82.0, q1: 64.0, q0: 23.0 }, { mean: 70.9345, mode: 93.0, q4: 100.0, q3: 88.75, q2: 72.0, q1: 55.0, q0: 27.0 }, { mean: 75.369, mode: 100.0, q4: 100.0, q3: 93.0, q2: 79.0, q1: 56.0, q0: 38.0 }, { mean: 83.3155, mode: 100.0, q4: 100.0, q3: 97.0, q2: 87.5, q1: 70.5, q0: 45.0 }, { mean: 72.8393, mode: 90.0, q4: 100.0, q3: 90.0, q2: 76.5, q1: 56.25, q0: 31.0 }, { mean: 82.9226, mode: 100.0, q4: 100.0, q3: 98.0, q2: 87.0, q1: 72.0, q0: 45.0 }, { mean: 66.6726, mode: 84.0, q4: 97.0, q3: 81.0, q2: 66.5, q1: 53.0, q0: 42.0 }, { mean: 71.0893, mode: 96.0, q4: 100.0, q3: 85.0, q2: 73.0, q1: 56.0, q0: 44.0 }, { mean: 69.4702, mode: 93.0, q4: 100.0, q3: 87.0, q2: 72.0, q1: 54.0, q0: 32.0 }, { mean: 68.9345, mode: 76.0, q4: 100.0, q3: 82.0, q2: 70.0, q1: 54.0, q0: 37.0 }, { mean: 66.7024, mode: 42.0, q4: 100.0, q3: 83.0, q2: 68.5, q1: 48.0, q0: 34.0 }, { mean: 66.1726, mode: 94.0, q4: 100.0, q3: 83.0, q2: 69.0, q1: 50.25, q0: 26.0 }, { mean: 63.9107, mode: 78.0, q4: 94.0, q3: 78.0, q2: 64.0, q1: 50.0, q0: 32.0 }, { mean: 69.1488, mode: 94.0, q4: 100.0, q3: 88.0, q2: 73.0, q1: 54.0, q0: 26.0 }, { mean: 80.119, mode: 94.0, q4: 100.0, q3: 94.0, q2: 85.5, q1: 69.0, q0: 39.0 }, { mean: 67.4464, mode: 94.0, q4: 100.0, q3: 83.0, q2: 68.0, q1: 52.0, q0: 31.0 }, { mean: 76.3988, mode: 88.0, q4: 100.0, q3: 88.0, q2: 78.0, q1: 61.0, q0: 44.0 }, { mean: 70.375, mode: 94.0, q4: 100.0, q3: 88.0, q2: 69.0, q1: 54.0, q0: 37.0 }, { mean: 67.2917, mode: 100.0, q4: 100.0, q3: 87.0, q2: 67.5, q1: 47.0, q0: 30.0 }, { mean: 72.7262, mode: 82.0, q4: 100.0, q3: 88.0, q2: 73.0, q1: 60.25, q0: 28.0 }, { mean: 71.3452, mode: 87.0, q4: 100.0, q3: 87.0, q2: 73.0, q1: 54.5, q0: 29.0 }, { mean: 78.006, mode: 76.0, q4: 100.0, q3: 87.75, q2: 77.0, q1: 67.0, q0: 48.0 }, { mean: 82.875, mode: 100.0, q4: 100.0, q3: 93.0, q2: 85.5, q1: 76.0, q0: 40.0 }, { mean: 82.3274, mode: 100.0, q4: 100.0, q3: 93.75, q2: 87.0, q1: 72.0, q0: 48.0 }, { mean: 65.7857, mode: 66.0, q4: 100.0, q3: 81.0, q2: 66.0, q1: 51.25, q0: 28.0 }, { mean: 63.8631, mode: 51.0, q4: 94.0, q3: 75.0, q2: 63.0, q1: 51.0, q0: 26.0 }, { mean: 77.25, mode: 100.0, q4: 100.0, q3: 93.0, q2: 81.0, q1: 66.0, q0: 32.0 }, { mean: 70.8095, mode: 62.0, q4: 94.0, q3: 81.0, q2: 70.5, q1: 62.0, q0: 41.0 }, { mean: 84.2381, mode: 100.0, q4: 100.0, q3: 93.0, q2: 87.0, q1: 75.0, q0: 61.0 }, { mean: 83.0595, mode: 92.0, q4: 100.0, q3: 92.0, q2: 86.0, q1: 77.0, q0: 49.0 }, { mean: 76.3929, mode: 78.0, q4: 93.0, q3: 84.75, q2: 78.0, q1: 71.0, q0: 41.0 }, { mean: 78.8929, mode: 92.0, q4: 100.0, q3: 92.0, q2: 81.0, q1: 66.5, q0: 43.0 }, { mean: 81.1429, mode: 78.0, q4: 100.0, q3: 92.0, q2: 82.5, q1: 72.0, q0: 54.0 }
];

// var dObj = [monthlyDryBulb, monthlyRelHumid];
