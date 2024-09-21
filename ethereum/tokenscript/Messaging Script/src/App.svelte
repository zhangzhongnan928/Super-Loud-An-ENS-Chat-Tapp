<script lang="ts">
	import Messages from './routes/Messages.svelte';
	import context from './lib/context';
	import type {ITokenContextData} from "@tokenscript/card-sdk/dist/types";
	//import Partners from './routes/Partners.svelte';

	import Info from './routes/Info.svelte';
	import NotFound from './routes/NotFound.svelte';

	import Friendship from './routes/Friendship.svelte';
	import Trade from './routes/Trade.svelte';

	let token: ITokenContextData;
	let initialised = false;

	const routingMap = {
		'#messages': Messages,
		'#friendship': Friendship,
		'#info': Info,
		'#trade': Trade,
	};

	let page;

	function routeChange() {
		console.log("call routeChange");
		page = routingMap[document.location.hash || '#messages'] || NotFound;
	}

	tokenscript.tokens.dataChanged = async (oldTokens, updatedTokens, cardId) => {
		if (initialised) return;

		context.setToken(updatedTokens.currentInstance);
		token = updatedTokens.currentInstance;

		initialised = true;

		routeChange();
	};
</script>

<svelte:window on:hashchange={routeChange} />

<div>
	<div id="token-container">
		<svelte:component this={page} />
	</div>
</div>
