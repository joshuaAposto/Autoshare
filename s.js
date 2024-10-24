const serverUrls = {
    server1: 'https://joshua1-ybun.onrender.com',
    server2: 'https://joshua2.onrender.com',
    server3: 'https://joshua3.onrender.com',
};

async function checkServerStatus() {
    const servers = document.querySelectorAll('#server option');
    let allDown = true;
    let retries = 0;

    for (const server of servers) {
        const serverKey = server.value;
        try {
            const response = await fetch(serverUrls[serverKey]);
            if (response.ok) {
                server.textContent = `${serverKey.replace('server', 'Server ')} (active)`;
                allDown = false;
            } else {
                server.textContent = `${serverKey.replace('server', 'Server ')} (down)`;
            }
        } catch (error) {
            server.textContent = `${serverKey.replace('server', 'Server ')} (down)`;
        }
        retries++;
    }

    const submitButton = document.getElementById('submit-button');
    if (allDown) {
        submitButton.disabled = true;
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Server Error: Unable to retrieve servers. This might be due to no available servers or a connectivity issue. Please reload the page and ensure your internet connection is stable. Retries: ' + retries;
        errorMessage.style.color = '#f44336';
        errorMessage.style.textAlign = 'center';
        errorMessage.style.marginTop = '15px';
        errorMessage.style.fontSize = '14px';
        document.querySelector('.wrapper-container').appendChild(errorMessage);
    } else {
        submitButton.disabled = false;
    }
}

window.onload = checkServerStatus;

function validateAppState(appState) {
    return appState.length > 0;
}

async function submitForm(event) {
    event.preventDefault();
    const result = document.getElementById('result');
    const button = document.getElementById('submit-button');
    const selectedServer = document.getElementById('server').value;
    const server = serverUrls[selectedServer];
    const appState = document.getElementById('cookies').value;

    if (!validateAppState(appState)) {
        result.style.display = 'block';
        result.className = 'error';
        result.innerHTML = 'Invalid Appstate. Please check and try again.';
        return;
    }

    try {
        result.style.display = 'block';
        button.disabled = true;
        result.className = '';
        const response = await fetch(`${server}/api/submit`, {
            method: 'POST',
            body: JSON.stringify({
                cookie: appState,
                url: document.getElementById('urls').value,
                amount: document.getElementById('amounts').value,
                interval: document.getElementById('intervals').value,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.status === 200) {
            result.className = 'success';
            result.innerHTML = 'Submitted successfully!';
        } else {
            result.className = 'error';
            result.innerHTML = 'Error: ' + data.message;
        }
    } catch (error) {
        result.className = 'error';
        result.innerHTML = 'Network error, please try again later.';
    } finally {
        button.disabled = false;
    }
}
