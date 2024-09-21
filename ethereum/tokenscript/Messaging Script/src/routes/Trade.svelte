<script lang="ts">
	import context from '../lib/context';
	import Loader from '../components/Loader.svelte';
	let loading = true;
	let timeout: any;
	let searchString: string;
	let filteredSwaps: any;

	// TODO make this dynamic with regards to the addresses used above.

	context.data.subscribe(async (value) => {
		if (!value.token) return;
		//token = value.token;
		// @ts-ignore
		filteredSwaps = swapList();
		loading = false;
	});

	function swapList() {
		//const slnAddress = token.contractAddress;
		//const chainId = token.chainId;
		return [
			{
				title: 'Uniswap',
				type: 'dex',
				logo: 'https://cdn.jsdelivr.net/gh/SmartTokenLabs/resources/images/logos/UniSwap.svg',
				url: 'https://app.uniswap.org/swap?chain=base&exactField=output&outputCurrency=0x55f7d6d2e9122ba0ee0e8c8566aef9c4dda05351&inputCurrency=eth'
			},
			{
				title: '1inch',
				type: 'dex',
				logo: 'https://cryptologos.cc/logos/1inch-1inch-logo.png?v=035',
				url: 'https://app.1inch.io/#/8453/simple/swap/ETH/0x55f7d6d2e9122ba0ee0e8c8566aef9c4dda05351'
			}
		];
	}

	function filterSwaps(query: string) {
		const lowercaseQuery = query.toLowerCase();
		filteredSwaps = swapList().filter((swap: any) => {
			const { title } = swap;
			return title.toLowerCase().includes(lowercaseQuery);
		});
	}
</script>

<div>
	<div id="token-container" style="color: black;">
		<div class="field-section" style="padding-bottom: 12px;">
			<div class="text-3xl field-section-title neue-plak" style="font-size: 24px;">Trade $SLT</div>

		</div>
		<div>
            {#each filteredSwaps as swap}
              <a
                href={swap.url}
                target="_blank"
                style="display: flex; align-items: center; padding: 12px; background-color: #1E233C; border: 1px solid #4A5568; border-radius: 8px; margin-bottom: 18px; text-decoration: none; color: black; transition: all 0.3s ease;"
              >
                <!-- Logo on the left -->
                <div style="width: 32px; margin-right: 16px;">
                  <img src="{swap.logo}" alt="Logo" style="width: 100%;" />
                </div>
          
                <!-- Text (name/title) in the center -->
                <div style="flex-grow: 1; display: flex; flex-direction: column; align-items: center;">
                  <div style="font-size: 24px; color: white;">{swap.title}</div>
                </div>
              </a>
            {/each}
          </div>          
	</div>
	<Loader show={loading} />
</div>