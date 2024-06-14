<template>
	<view>
		<view v-if="login == false">
			<view class="page">
				<view class="login_entry">
					<view class="left_entry">
						<button class="button_shape" style="background-color: #4db8ff;" @click="LoginEntry('user')">我是用户</button>
					</view>
					<view class="right_entry">
						<button class="button_shape" style="background-color: #ff9966;" @click="LoginEntry('admin')">我是管理员</button>
					</view>
				</view>
			</view>
		</view>
		<view v-if="login == false && page == 'login'">
			<view class="page">
				<view v-if="role == 'user'" class="page">
					<view class="input_box">
						<u--form :model="form" ref="uForm" labelAlign="center">
							<u-form-item label="姓名" prop="name">
								<u-input prefixIcon="account" border shape="square" placeholder="请输入姓名"></u-input>
							</u-form-item>
							<u-form-item label="电话" prop="phone">
								<u-input prefixIcon="phone" border shape="square" placeholder="请输入电话"></u-input>
							</u-form-item>
							<u-form-item label="房间" prop="room">
								<u-input border shape="square" placeholder="请输入房间号"></u-input>
							</u-form-item>
						</u--form>
					</view>
					<view class="commit_box">
						<u-button type="primary" :plain="true" :hairline="true" shape="circle" @click="Login()">登记入住</u-button>
					</view>
				</view>
				<view v-else-if="role == 'admin'" class="page">
					<view class="input_box">
						<u-form :model="form" ref="uForm" borderBottom="false" labelAlign="center">
							<u-form-item label="账号" prop="name" borderBottom="false">
								<u-input border shape="square" placeholder="请输入姓名" />
							</u-form-item>
							<u-form-item label="密码" prop="phone" borderBottom="false">
								<u-input border shape="square" placeholder="请输入密码" />
							</u-form-item>
						</u-form>
					</view>
					<view class="commit_box">
						<u-button type="primary" :plain="true" :hairline="true" shape="circle" @click="Login()">登录</u-button>
					</view>
				</view>
			</view>
		</view>
		<view v-if="login == true && !target_wind_set && !change_temperature">
			<u-tabbar
				:value="page"
				@change="(name) => PageProxy(name)"
				:fixed="true"
				:placeholder="false"
				:safeAreaInsetBottom="true"
			>
				<u-tabbar-item name="home" text="控制" icon="home" @click="(name) => PageProxy(name)" ></u-tabbar-item>
				<u-tabbar-item name="mine" text="账单" icon="account" @click="(name) => PageProxy(name)" ></u-tabbar-item>
			</u-tabbar>
		</view>
		<view style="position: sticky;">
			<u--text type="info" :text="time_display" size="20"></u--text>
		</view>
		
		<view v-if="page == 'control' && login == true && role == 'user'">
			<view class="page">
				<view class="control_display">
					<u-popup :show="change_temperature" mode="center" :round="10" @close="change_temperature = false">
						<u-picker :show="target_wind_set" :column="target_wind_speed"></u-picker>
						<view class="make_request">
							<view class="target_temperature_display">
								<label>目标温度</label>
								<u-slider v-model="target_temperature" :min="change_temperature_min" :max="change_temperature_max" step="0.1" activeColor="#ffba0a" showValue:true></u-slider>
							</view>
							<view class="target_wind_display">
								<u-cell title="目标风速" border:false :value="target_wind" isLink="true" @click="target_wind_set = true"></u-cell>
							</view>
							<view class="commit_box" style="width: 40vw;margin-top: 2vh;margin-left: 20vw;">
								<u-button type="success" :plain="true" :hairline="true" shape="circle" @click="change_temperature = true">调整温度</u-button>
							</view>
						</view>
					</u-popup>
					<u-cell-group :customStyle="AC_status_display">
						<u-cell title="当前温度" :value="room_status.temperature"></u-cell>
						<u-cell title="空调是否开启">
							<template v-slot:value>
								<u-switch v-model="AC_working" asyncChange:true @change="ACStatusChange"></u-switch>
							</template>
						</u-cell>
						<u-cell title="空调制导模式" :disabled="!AC_working" :value="mode_cn"></u-cell>
					</u-cell-group>
					<view class="commit_box">
						<u-button type="success" :disabled="!true" :plain="true" :hairline="true" shape="circle" @click="Test()">调整温度</u-button>
					</view>
				</view>
			</view>
		</view>
		<view v-if="page == 'monitor' && login == true && role == 'admin'">
			
			<view class="page">
				
				<view class="room_table">
					<!-- <u-parse :content="room_table_html"></u-parse> -->
					<rich-text :nodes="room_table_html"></rich-text>
				</view>
				<view>
					<button @click="Test()">测试</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				login: false,
				role: "user	",
				page: "control",
				room_status: {
					AC_status: 'off',
					AC_working: 'rest',
					temperature: 25,
				},
				request: {
					current_temperature: 25,
					target_temperature: 18,
					target_wind: 2,
				},
				mode_cn: "制冷",
				mode: "cold",
				form: {
					name: 'test',
					phone: 'test',
					room: '301'
				},
				AC_status_display: {
					'position': 'relative',
					'width': '100vw',
					'margin-top': '20vh',
					'background-color': '#ffffff'
				},
				change_temperature: false,
				change_temperature_max: 0,
				change_temperature_min: 0,
				target_wind: "中",
				target_wind_speed: [
					['低', '中', '高']
				],
				target_wind_set: false,
				time: 0,
				time_display: "",
				room_table: [],
				room_table_html: "",
				new_item: {},
			}
		},
		onLoad() {
			const app = getApp();
			
			this.socket = app.globalData.socket;
			this.socket.onMessage((message) => {
				const msg = JSON.parse(message.data);
				if (msg.type == 'MinutePassed') {
					this.time = msg.time;
					this.time_display = `当前时间：第${msg.time}分钟`;
				} else if (msg.type == 'TemperatureUpdate') {
					this.room_status.temperature = msg.data;
				} else if (msg.type == 'RoomsTable') {
					this.new_item = { room: `${msg.room}`, temperature: `${msg.temperature}`, AC_status: `${msg.AC_status}` };
					const index = this.room_table.findIndex(item => item.room === this.new_item.room);
					if (index !== -1) {
						// 更新现有的数据
						this.room_table[index] = this.new_item;
					} else {
						// 添加新的数据
						this.room_table.push(this.new_item);
					}
					// this.room_table_html = this.generateTableHtml([
					// 	{ room: `${msg.room}`, temperature: `${msg.temperature}`, AC_status: `${msg.AC_status}` },
					// ]);
					this.room_table_html = this.generateTableHtml(this.room_table);
				};
			});
		},
		methods: {
			LoginEntry(role) {
				this.role = role;
				this.PageProxy("login");
			},
			PageProxy(page) {
				this.page = page;
			},
			Login() {
				this.PageProxy("control");
				//根据role判断
			},
			Setlimits(mode){
				if (mode === "cold") {
					this.change_temperature_max = 28;
					this.change_temperature_min = 18;
				} else {
					this.change_temperature_max = 28;
					this.change_temperature_min = 18;
				}
			},
			ACStatusChange(value) {
				console.log(this.AC_working);
				this.AC_working = value;
				console.log(this.AC_working);
			},
			Login() {
				const data = {
					type: 'login',
					role: this.role,
					room: this.form.room,
					temperature: this.room_status.temperature,
					AC_status: this.room_status.AC_status,
					enviroment: this.room_status.enviroment,
				}
				this.socket.send({
					data: JSON.stringify(data),
				})
				this.PageProxy('control')
			},
			Request() {
				const data = {
					type: 'request',
					room: this.form.room,
					current_temperature: this.request.current_temperature,
					target_temperature: this.request.target_temperature,
					wind: this.request.target_wind,
				}
				this.socket.send({
					data: JSON.stringify(data)
				})
			},
			generateTableHtml(data) {
				let html = `<table border="1" style="border-collapse: collapse; width: 100%;">
							  <thead>
								<tr>
								  <th style="text-align: center; border: 1px solid black;">房间号</th>
								  <th style="text-align: center; border: 1px solid black;">当前温度</th>
								  <th style="text-align: center; border: 1px solid black;">空调状态</th>
								</tr>
							  </thead>
							  <tbody>`;

				data.forEach(item => {
				  html += `<tr>
							 <td style="border: 1px solid black;">${item.room}</td>
							 <td style="border: 1px solid black;">${item.temperature}</td>
							 <td style="border: 1px solid black;">${item.AC_status}</td>
						   </tr>`;
				});

				html += `  </tbody>
						  </table>`;
				return html;
			},
			Test() {
				const data_a = {
					type: 'login',
					role: 'user',
					room: '301',
					temperature: 25,
					AC_status: 'on',
					enviroment: 25,
				}
				this.socket.send({
					data: JSON.stringify(data_a),
				})
				
				const data_b = {
					type: 'login',
					role: 'user',
					room: '302',
					temperature: 26,
					AC_status: 'on',
					enviroment: 26,
				}
				this.socket.send({
					data: JSON.stringify(data_b),
				})
				
				const data_c = {
					type: 'login',
					role: 'user',
					room: '303',
					temperature: 27,
					AC_status: 'on',
					enviroment: 27,
				}
				this.socket.send({
					data: JSON.stringify(data_c),
				})
				
				const data1 = {
					type: 'request',
					room: '301',
					current_temperature: 25,
					target_temperature: 17,
					wind: 2,
				}
				this.socket.send({
					data: JSON.stringify(data1)
				})
				
				const data2 = {
					type: 'request',
					room: '302',
					current_temperature: 26,
					target_temperature: 16,
					wind: 2,
				}
				this.socket.send({
					data: JSON.stringify(data2)
				})
				
				const data3 = {
					type: 'request',
					room: '303',
					current_temperature: 27,
					target_temperature: 15,
					wind: 3,
				}
				this.socket.send({
					data: JSON.stringify(data3)
				})
				
				const data_admin = {
					type: 'login',
					role: 'admin',
				}
				this.socket.send({
					data: JSON.stringify(data_admin),
				})
			},
		}
	}
</script>

<style>
	.page {
		position: fixed;
		width: 100vw;
		height: 84vh;
		top: 5vh;
	}

	/* entry */
	.login_entry {
		position: absolute;
		width: 100vw;
		height: 25vh;
		top: 50vh;
		display: flex;
		justify-content: space-between;
	}

	.left_entry {
		width: 175px;
		height: 175px;
		margin-top: 2.5vh;
		margin-left: 5vw;
	}

	.right_entry {
		width: 175px;
		height: 175px;
		margin-top: 2.5vh;
		margin-right: 5vw;
	}

	.button_shape {
		width: 175px;
		height: 175px;
		line-height: 175px;
		border-radius: 25px;
		font-size: 30px;
	}

	/* login */
	.input_box {
		position: relative;
		width: 100vw;
		background-color: white;
	}

	.commit_box {
		position: relative;
		width: 80vw;
		margin-left: 10vw;
		margin-top: 5vh;
	}
	
	.make_request {
		position: fixed;
		top: 25vh;
		left: 10vw;
		width: 80vw;
		height: 40vh;
		background-color: white;
		border-radius: 20px;
	}
	
	.target_temperature_display {
		position: relative;
		width: 75vw;
		height: 10vh;
		margin-top: 5vh;
		margin-left: 2.5vw;
	}
	
	.target_wind_display {
		position: relative;
		width: 75vw;
		height: 10vh;
		margin-top: 5vh;
		margin-left: 2.5vw;
	}

</style>
