// 1. DEFINE THE METRO MAP (Graph)
// Format: { StationName: { ConnectedStation: "LineColor" } }
const metroMap = {
    // Red Line
    "Central Station": { "Museum": "Red", "City Mall": "Blue" },
    "Museum": { "Central Station": "Red", "Tech Park": "Red" },
    "Tech Park": { "Museum": "Red", "University": "Red", "North Hub": "Green" },
    "University": { "Tech Park": "Red", "Airport": "Red" },
    "Airport": { "University": "Red" },

    // Blue Line
    "City Mall": { "Central Station": "Blue", "Harbor": "Blue" },
    "Harbor": { "City Mall": "Blue", "Stadium": "Blue" },
    "Stadium": { "Harbor": "Blue", "West End": "Blue", "Lake View": "Green" },
    "West End": { "Stadium": "Blue" },

    // Green Line
    "North Hub": { "Tech Park": "Green", "Forest Park": "Green" },
    "Forest Park": { "North Hub": "Green", "Lake View": "Green" },
    "Lake View": { "Forest Park": "Green", "Stadium": "Blue", "South Terminal": "Green" },
    "South Terminal": { "Lake View": "Green" }
};

// 2. POPULATE DROPDOWNS
const startSelect = document.getElementById('start-station');
const endSelect = document.getElementById('end-station');
const findRouteBtn = document.getElementById('find-route-btn');
const resultContainer = document.getElementById('result-container');

const stations = Object.keys(metroMap);
stations.forEach(station => {
    startSelect.add(new Option(station, station));
    endSelect.add(new Option(station, station));
});

// 3. PATHFINDING ALGORITHM (Breadth-First Search to find shortest path)
function findRoute(start, end) {
    if (start === end) return [start];

    let queue = [[start]]; // Stores paths
    let visited = new Set([start]);

    while (queue.length > 0) {
        let currentPath = queue.shift();
        let currentNode = currentPath[currentPath.length - 1];

        let neighbors = metroMap[currentNode];
        
        for (let neighbor in neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                let newPath = [...currentPath, neighbor];
                
                if (neighbor === end) {
                    return newPath; // Return the shortest path found
                }
                queue.push(newPath);
            }
        }
    }
    return null; // No path found
}

// 4. PROCESS AND DISPLAY RESULTS
findRouteBtn.addEventListener('click', () => {
    const startStation = startSelect.value;
    const endStation = endSelect.value;

    if (!startStation || !endStation) {
        alert("Please select both a start and end station.");
        return;
    }

    const path = findRoute(startStation, endStation);

    if (!path) {
        alert("No route found between these stations.");
        resultContainer.classList.add('hidden');
        return;
    }

    // Calculate details
    const totalTime = (path.length - 1) * 3; // Assume 3 mins per station
    let interchanges = 0;
    const routeSteps = document.getElementById('route-steps');
    routeSteps.innerHTML = ''; // Clear previous results

    // Build the visual route
    path.forEach((station, index) => {
        const li = document.createElement('li');
        const nameSpan = document.createElement('span');
        nameSpan.className = 'station-name';
        nameSpan.textContent = station;

        const lineSpan = document.createElement('span');
        lineSpan.className = 'line-info';

        // Determine the line taken to get to this station
        if (index === 0) {
            // Starting station
            const nextStation = path[index + 1];
            lineSpan.textContent = `Board ${metroMap[station][nextStation]} Line`;
        } else {
            const prevStation = path[index - 1];
            const lineTaken = metroMap[prevStation][station];
            
            // Check if it's an interchange (has more than 1 line passing through)
            const linesAtStation = new Set(Object.values(metroMap[station]));
            if (linesAtStation.size > 1 && index !== path.length - 1) {
                li.classList.add('interchange');
                interchanges++;
                const nextStation = path[index + 1];
                const nextLine = metroMap[station][nextStation];
                lineSpan.textContent = `Interchange to ${nextLine} Line`;
            } else {
                lineSpan.textContent = `${lineTaken} Line`;
            }
        }

        li.appendChild(nameSpan);
        li.appendChild(lineSpan);
        routeSteps.appendChild(li);
    });

    // Update summary text
    document.getElementById('time-display').textContent = `Time: ~${totalTime} mins`;
    document.getElementById('interchange-display').textContent = `Interchanges: ${interchanges}`;

    // Show results
    resultContainer.classList.remove('hidden');
});