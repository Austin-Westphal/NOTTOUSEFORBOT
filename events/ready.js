const sql = require('sqlite');
const settings = require('../settings.json');
sql.open(`../${settings.sqlitefilename}.sqlite`);
exports.run = async client => {
	const Discord = require('discord.js');
	const chalk = require('chalk');

	await client.guildconfs.defer.then(() => {
		console.log(chalk.green(`${client.guildconfs.size}keys loaded for all discord servers`));
	});
	await client.botconfs.defer.then(() => {
		console.log(chalk.green(`${client.botconfs.size}keys loaded for all bot configs`));
	});
	await client.userdb.defer.then(() => {
		console.log(chalk.green(`${client.userdb.size}keys loaded for all user keys`));
	});

	const botconfsdefault = {
		blacklist: [],
		banlist: []
	};

	const botconfig = {
		activity: false,
		activitychannel: '',
		tickets: {},
		ticketid: 0
	};

	const marketconfs = {
		crate: ['📁', '14', '12', '14', '12'],
		cratekey: ['🔑', '75', '68', '75', '68'],
		pickaxe: ['⛏', '70', '62', '70', '62'],
		joystick: ['🕹', '60', '54', '60', '54'],
		house: ['🏠', '10000', '9000', '10000', '9000'],
		bag: ['👜', '15', '13', '15', '13'],
		diamond: ['💠', '2000', '1800', '2000', '1800'],
		dog: ['🐶', '25', '23', '25', '23'],
		cat: ['🐱', '25', '23', '25', '23'],
		apple: ['🍎', '5', '4', '5', '4'],
		football: ['⚽', '10', '9', '10', '9'],
		car: ['🚙', '6000', '5400', '6000', '5400'],
		phone: ['📱', '400', '360', '400', '360'],
		computer: ['💻', '1000', '900', '1000', '900'],
		camera: ['📷', '600', '540', '600', '540'],
		clock: ['⏰', '15', '13', '15', '13'],
		inventoryslotticket: ['📩', '200', '180', '200', '180'],
		rose: ['🌹', '10', '8', '10', '8'],
		umbrella: ['☂', '30', '27', '30', '27'],
		hamburger: ['🍔', '45', '40', '45', '40'],
		croissant: ['🥐', '9', '8', '9', '8'],
		basketball: ['🏀', '50', '45', '50', '45'],
		watch: ['⌚', '190', '171', '190', '171'],
		projector: ['📽', '623', '560', '623', '560'],
		flashlight: ['🔦', '80', '72', '80', '72'],
		bed: ['🛏', '236', '212', '236', '212'],
		hammer: ['🔨', '50', '45', '50', '45'],
		book: ['📖', '11', '10', '11', '10'],
		mag: ['🔍', '12', '10', '12', '10'],
		banana: ['🍌', '4', '3', '4', '3'],
		tractor: ['🚜', '15000', '13500', '15000', '13500'],
		syringe: ['💉', '132', '119', '132', '119'],
		gun: ['🔫', '674', '608', '674', '608'],
		knife: ['🔪', '87', '78', '87', '78']
	};

	const botconfspremium = {};

	client.user.setPresence({
		game: {
			name: `?help | www.lenoxbot.com`,
			type: 0
		}
	});

	if (!client.botconfs.has('blackbanlist')) client.botconfs.set('blackbanlist', botconfsdefault);
	if (!client.botconfs.has('botconfs')) client.botconfs.set('botconfs', botconfig);
	client.botconfs.set('market', marketconfs);
	if (!client.botconfs.has('premium')) client.botconfs.set('premium', botconfspremium);

	client.botconfs.set('botstats', {
		botguildscount: client.guilds.size,
		botmemberscount: client.users.size,
		botcommands: client.botconfs.get('botconfs').commandsexecuted,
		botcommandsincrement: Math.floor(client.botconfs.get('botconfs').commandsexecuted / 170) + 1,
		botmemberscountincrement: Math.floor(client.users.size / 170) + 1,
		botguildscountincrement: Math.floor(client.guilds.size / 170) + 1
	});

	setInterval(() => {
		client.botconfs.set('botstats', {
			botguildscount: client.guilds.size,
			botmemberscount: client.users.size,
			botcommands: client.botconfs.get('botconfs').commandsexecuted,
			botcommandsincrement: Math.floor(client.botconfs.get('botconfs').commandsexecuted / 170) + 1,
			botmemberscountincrement: Math.floor(client.users.size / 170) + 1,
			botguildscountincrement: Math.floor(client.guilds.size / 170) + 1
		});
	}, 1800000);

	const botconfs = await client.botconfs.get('botconfs');

	const embed = new Discord.RichEmbed()
		.setTitle('Botrestart')
		.setDescription('LenoxBot had a restart and is back again!\nEveryone can now execute commands!')
		.setColor('#99ff66')
		.setAuthor(client.user.tag, client.user.displayAvatarURL);

	if (client.user.id === '354712333853130752') {
		client.channels.get('497400107109580801').send({
			embed
		});
	}

	if (client.user.id === '354712333853130752') {
		setInterval(() => {
			client.dbl.postStats(client.guilds.size);
		}, 1800000);
	}

	function timeoutForDaily(dailyreminder, timeoutTime) {
		setTimeout(() => {
			client.users.get(dailyreminder.userID).send('Don\'t forget to pick up your daily reward');
			delete botconfs.dailyreminder[dailyreminder.userID];
			client.botconfs.set('botconfs', botconfs);
		}, timeoutTime);
	}

	if (Object.keys(client.botconfs.get('botconfs').dailyreminder).length !== 0) {
		/* eslint guard-for-in: 0 */
		for (const index in client.botconfs.get('botconfs').dailyreminder) {
			const timeoutTime = botconfs.dailyreminder[index].remind - Date.now();
			timeoutForDaily(botconfs.dailyreminder[index], timeoutTime);
		}
	}

	function timeoutForJob(jobreminder, timeoutTime) {
		setTimeout(() => {
			const userdb = client.userdb.get(jobreminder.userID);
			userdb.jobstatus = false;
			client.userdb.set(jobreminder.userID, userdb);

			delete botconfs.jobreminder[jobreminder.userID];
			client.botconfs.set('botconfs', botconfs);

			sql.get(`SELECT * FROM medals WHERE userId ="${jobreminder.userID}"`).then(row => {
				if (!row) {
					sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [jobreminder.userID, 0]);
				}
				sql.run(`UPDATE medals SET medals = ${row.medals + jobreminder.amount} WHERE userId = ${jobreminder.userID}`);
			});

			const jobfinish = `Congratulations! You have successfully completed your job. You earned a total of ${jobreminder.amount} credits`;
			client.users.get(jobreminder.userID).send(jobfinish);
		}, timeoutTime);
	}

	if (Object.keys(client.botconfs.get('botconfs').jobreminder).length !== 0) {
		/* eslint guard-for-in: 0 */
		for (const index in client.botconfs.get('botconfs').jobreminder) {
			const timeoutTime = botconfs.jobreminder[index].remind - Date.now();
			timeoutForJob(botconfs.jobreminder[index], timeoutTime);
		}
	}

	function timeoutForBan(bansconf, newBanTime, fetchedbansfromfunction) {
		setTimeout(() => {
			const fetchedbans = fetchedbansfromfunction;
			const tableload = client.guildconfs.get(bansconf.discordserverid);

			if (fetchedbans.has(bansconf.memberid)) {
				const user = fetchedbans.get(bansconf.memberid);

				client.guilds.get(bansconf.discordserverid).unban(user);

				const lang = require(`../languages/${tableload.language}.json`);
				// CHANGE TO THE NEW CROWDIN SYSTEM
				if (tableload.language === 'en') {
					tableload.language = 'en-US';
					client.guildconfs.set(bansconf.discordserverid, tableload);
				}

				if (tableload.language === 'ge') {
					tableload.language = 'de-DE';
					client.guildconfs.set(bansconf.discordserverid, tableload);
				}

				if (tableload.language === 'fr') {
					tableload.language = 'fr-FR';
					client.guildconfs.set(bansconf.discordserverid, tableload);
				}
				// CHANGE TO THE NEW CROWDIN SYSTEM

				const unbannedby = lang.unban_unbannedby.replace('%authortag', `${client.user.tag}`);
				const automaticbandescription = lang.temporaryban_automaticbandescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id);
				const unmutedembed = new Discord.RichEmbed()
					.setAuthor(unbannedby, client.user.displayAvatarURL)
					.setThumbnail(user.displayAvatarURL)
					.setColor('#FF0000')
					.setTimestamp()
					.setDescription(automaticbandescription);

				if (tableload.modlog === 'true') {
					const modlogchannel = client.channels.get(tableload.modlogchannel);
					modlogchannel.send({
						embed: unmutedembed
					});
				}
			}
			const newbansconf = client.botconfs.get('botconfs');
			delete newbansconf.bans[botconfs.banscount];
			client.botconfs.set('botconfs', newbansconf);
		}, newBanTime);
	}

	function timeoutForMute(muteconf, newMuteTime) {
		setTimeout(() => {
			const guild = client.guilds.get(muteconf.discordserverid);
			if (!guild) return;

			const membermention = guild.members.get(muteconf.memberid);
			const role = client.guilds.get(muteconf.discordserverid).roles.get(muteconf.roleid);
			const user = client.users.get(muteconf.memberid);
			const tableload = client.guildconfs.get(muteconf.discordserverid);

			if (tableload && tableload.muterole !== '' && membermention.roles.has(tableload.muterole)) {
				membermention.removeRole(role);

				const lang = require(`../languages/${tableload.language}.json`);
				// CHANGE TO THE NEW CROWDIN SYSTEM
				if (tableload.language === 'en') {
					tableload.language = 'en-US';
					client.guildconfs.set(muteconf.discordserverid, tableload);
				}

				if (tableload.language === 'ge') {
					tableload.language = 'de-DE';
					client.guildconfs.set(muteconf.discordserverid, tableload);
				}

				if (tableload.language === 'fr') {
					tableload.language = 'fr-FR';
					client.guildconfs.set(muteconf.discordserverid, tableload);
				}
				// CHANGE TO THE NEW CROWDIN SYSTEM

				const unmutedby = lang.unmute_unmutedby.replace('%authortag', `${client.user.tag}`);
				const automaticunmutedescription = lang.unmute_automaticunmutedescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id);
				const unmutedembed = new Discord.RichEmbed()
					.setAuthor(unmutedby, client.user.displayAvatarURL)
					.setThumbnail(user.displayAvatarURL)
					.setColor('#FF0000')
					.setTimestamp()
					.setDescription(automaticunmutedescription);

				user.send({
					embed: unmutedembed
				});

				if (tableload.modlog === 'true') {
					const modlogchannel = client.channels.get(tableload.modlogchannel);
					modlogchannel.send({
						embed: unmutedembed
					});
				}
			}
			const newmuteconf = client.botconfs.get('botconfs');
			delete newmuteconf.mutes[muteconf.mutescount];
			client.botconfs.set('botconfs', newmuteconf);
		}, newMuteTime);
	}

	if (Object.keys(client.botconfs.get('botconfs').bans).length !== 0) {
		/* eslint guard-for-in: 0 */
		for (const index in client.botconfs.get('botconfs').bans) {
			const bansconf = await client.botconfs.get('botconfs');
			const newBanTime = bansconf.bans[index].banEndDate - Date.now();
			const fetchedbans = await client.guilds.get(bansconf.bans[index].discordserverid).fetchBans();
			timeoutForBan(bansconf.bans[index], newBanTime, fetchedbans);
		}
	}

	if (Object.keys(client.botconfs.get('botconfs').mutes).length !== 0) {
		for (const index2 in client.botconfs.get('botconfs').mutes) {
			const muteconf = await client.botconfs.get('botconfs');
			const newMuteTime = muteconf.mutes[index2].muteEndDate - Date.now();
			timeoutForMute(muteconf.mutes[index2], newMuteTime);
		}
	}

	setInterval(() => {
		client.guilds.filter(g => client.guilds.has(g.id)).forEach(g => {
			const tableload = client.guildconfs.get(g.id);
			if (tableload && tableload.premium) {
				if (client.guildconfs.get(g.id).premium.status === true) {
					if (new Date().getTime() >= Date.parse(tableload.premium.end)) {
						tableload.premium.status = false;
						tableload.premium.bought = [];
						tableload.premium.end = '';
						client.guildconfs.set(g.id, tableload);
					}
				}
			}
		});
	}, 86400000);

	setInterval(() => {
		client.users.filter(g => client.userdb.has(g.id)).forEach(g => {
			const userdb = client.userdb.get(g.id);
			if (userdb.premium) {
				if (client.userdb.get(g.id).premium.status === true) {
					if (new Date().getTime() >= Date.parse(userdb.premium.end)) {
						userdb.premium.status = false;
						userdb.premium.bought = [];
						userdb.premium.end = '';
						client.userdb.set(g.id, userdb);
					}
				}
			}
		});
	}, 86400000);

	console.log(chalk.green(`LenoxBot: Ready to serve in ${client.channels.size} channels on ${client.guilds.size}, for a total of ${client.users.size} users.`));
};
