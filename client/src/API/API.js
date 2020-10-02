const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/v1/messages' : 'production_url_here'


export function getMessages() {
    return fetch(API_URL)
        .then(res => res.json())
        .then(messages => {
            const haveSeenLocation = {}
            return messages.reduce((all, message) => {
                const key = `${message.latitude.toFixed(2)}${message.longitude.toFixed(2)}`
                if (haveSeenLocation[key]) {
                    console.log(haveSeenLocation[key], 'key')
                    haveSeenLocation[key].otherMessages = haveSeenLocation[key].otherMessages || []
                    haveSeenLocation[key].otherMessages.push(message)
                } else {
                    haveSeenLocation[key] = message;
                    all.push(message);
                }
                return all;
            }, [])
        })
}

export function getLocation() {
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition((position) => {
            resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            )
        }, () => {
            console.log('uh, oh... they didnt give us their location...')
            resolve(fetch('http://ip-api.com/json/')
                .then(res => res.json())
                .then(location => {
                    return {
                            lat: location.lat,
                            lng: location.lon
                        }
                }));
        })
    })
}

export function sendMessage(message) {
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    })
        .then(res => res.json())
}

