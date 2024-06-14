<script>
	export default {
		onLaunch: function() {
			this.globalData.socket = this.connectSocket();
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			connectSocket() {
				const socket = wx.connectSocket({
					url: 'wss://antaresz.cc:42133',
					success: () => {
						console.log('WebSocket connection established');
					},
					fail: (err) => {
						console.error('WebSocket connection failed:', err);
					}
				});

				socket.onOpen(() => {
					console.log('WebSocket connection opened');
				});

				socket.onClose(() => {
					console.log('WebSocket connection closed');
					// 重连逻辑
					setTimeout(() => {
						this.globalData.socket = this.connectSocket();
					}, 1000);
				});

				socket.onError((error) => {
					console.log('WebSocket error:', error);
				});
				
				return socket;
			}
		},
		globalData: {
			socket: null,
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	@import '@/uni_modules/uview-ui/index.scss';
	@import '@/source/css/styles.css';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	// 设置整个项目的背景色
	page {
		background-color: #f3f3f3;
		font-family: 'YS';
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>
