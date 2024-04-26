(() => {
	const $ = document.querySelector.bind(document)
	let turn = 0
	const API_TURN = 'https://api.iname.me/api/get_turn'
	const API_POST = 'https://api.iname.me/api/active_rotation'
	const API_COINS = 'https://api.iname.me/api/list_rotation'
	const API_TOTAL = 'https://api.iname.me/api/get_xu'
	let timeRotate = 7000
	let currentRotate = 0
	let isRotating = false
	let coin = 0
	let listGift = []
	let size = 0
	const wheel = $('.wheel')
	const btnWheel = $('.btn')
	const showTurn = $('.count')
	const showCoin = $('.coin')
	const popup = $('.popup')
	const popupText = $('.popup p')
	const popupClose = $('.popup-close')
	const urlParams = new URLSearchParams(window.location.search);
	let rawToken = urlParams.get('token');

	var access_token = rawToken.replace(/ /g, '+');

	popupClose.addEventListener('click', function() {
		popup.classList.remove('active')
	})

	const options = {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	}

	// Get turn from API
	const fetchData = async(url) => {
		try {
				const response = await fetch(url, options);

				if (!response.ok) {
					throw new Error('Failed to fetch data');
				}

				const data = await response.json();

				return data;

		} catch (error) {
				console.error('Error fetching data:', error);
				throw error;
		}
	}

	const getData = async(url) => {
		try {
				const data = await fetchData(url);
				if(data.code ==500){
					turn ="";
				}else{
					turn = data.data
				}
				showTurn.innerHTML = `${turn}`

		} catch (error) {
				console.error('Error getting data:', error);
		}
	}

	getData(API_TURN);

	// Get login status from API
	const fetchLoginStatus = async(url) => {
		try {
				const response = await fetch(url, options);

				if (!response.ok) {
					throw new Error('Failed to fetch data');
				}

				const data = await response.json();

				return data;

		} catch (error) {
				console.error('Error fetching data:', error);
				throw error;
		}
	}

	// Get total coin from API
	const fetchDataTotal = async(url) => {
		try {
				const response = await fetch(url, options);

				if (!response.ok) {
					throw new Error('Failed to fetch data');
				}

				const data = await response.json();

				return data;

		} catch (error) {
				console.error('Error fetching data:', error);
				throw error;
		}
	}

	const getDataTotal = async(url) => {
		try {
				const data = await fetchDataTotal(url);

				coin = data.data.so_xu
				if(data.code ==500){
					showCoin.innerHTML = ``

				}else{
					showCoin.innerHTML = `${numeral(coin).format('0,0')}`
				}

		} catch (error) {
				console.error('Error getting data:', error);
		}
	}

	getDataTotal(API_TOTAL);

	// Update turn after user run the wheel
	const updateTurn = async () => {
		try  {
				const response = await fetch(API_POST, {
				method: "POST",
				headers: {
					// Authorization: `Bearer ${access_token}`,
					Authorization: "Bearer IgdzDgVoeb5MtfdxHpnQQ2K55m6YfGU8tn1ah1hZN6oRvcbab228SysMAob+2nInbr3At/jRga5gVMevnDGln691ilRjbj9jPr2JGlPR8iELU+W/tMa/ZDT8EniuK05KJyOlDYpixWCjAbxrWZ/wZHCWKOpPow68mvMVQHTCScl5kax/GLLOtH/QdQU9bkId2tgRlZ26i5gIQFc0C2jJlPCmIe8kqjKKp+hJvyBTzY+ST2y9pT0QkZFX+Tn1oNLcwycuqVTB7WQIPI7By2ZCa9oLRooeMj0+jlkjYuZWAI0=",
				}
			});

			return response.json();

		} catch(error) {
			console.error("Error:", error);
		}
	}

	// Get list coin from API
	const fetchDataCoins = async(url) => {
		try {
				const response = await fetch(url, options);

				if (!response.ok) {
					throw new Error('Failed to fetch data');
				}

				const data = await response.json();

				return data;

		} catch (error) {
				console.error('Error fetching data:', error);
				throw error;
		}
	}

	const getDataCoins = async(url) => {
		try {
				const data = await fetchDataCoins(url);

				listGift = data.data

				size = listGift.length
				const rotate = 360 / size
				const skewY = 90 - rotate
				if(size >0){
					listGift.map((item, index) => {
						const elm = document.createElement('li')

						elm.style.transform = `rotate(${rotate * index + (rotate / 2)}deg) skewY(-${skewY}deg)`;

						if (index % 2 === 0) {
							elm.innerHTML = `
							<p style="transform: skewY(${skewY}deg) rotate(${rotate / 2}deg)" class="text text-1">
								<strong>${item.name}</strong>
							</p>`
						} else {
							elm.innerHTML = `
							<p style="transform: skewY(${skewY}deg) rotate(${rotate / 2}deg)" class="text text-2">
								<strong>${item.name}</strong>
							</p>`
						}

						wheel.appendChild(elm)
					})
				}


		} catch (error) {
				console.error('Error getting data:', error);
		}
	}

	getDataCoins(API_COINS);

	const start = () => {
		isRotating = true
		currentRotate += 360 * 7 // Number of revolutions

		updateTurn()
			.then(data => {
				let index = 0
				gift = listGift.filter(item => item.id === data.data)

				listGift.map(coin => {
					if(coin.id === data.data) {
						index = listGift.indexOf(coin)
					}
				})

				if(turn > 0) {
					rotateWheel(currentRotate, index)
					showGift(gift, data.message)

				} else {
					popupText.innerHTML = 'Bạn đã hết lượt quay!'
					popup.classList.add('active')
					isRotating = false
				}
			})
	}

	// Spin of the wheel
	const rotateWheel = (currentRotate, index) => {
		size = listGift.length // Number of gifts
		const rotate = 360 / size // Number of item in wheel

		const rotateWheel = currentRotate - (index * rotate) - (rotate)

		$('.wheel').style.transform = `rotate(${rotateWheel}deg)`
	}

	// Show gift
	const showGift = (gift, mess) => {
		let timer = setTimeout(() => {
			turn--
			coin+=gift[0].point
			isRotating = false

			popupText.innerHTML = `${mess}`
			popup.classList.add('active')

			showTurn.innerHTML = `${turn}`
			showCoin.innerHTML = `${coin}`

			clearTimeout(timer)
		}, timeRotate)
	}

	btnWheel.addEventListener('click', () => !isRotating && start())
})()