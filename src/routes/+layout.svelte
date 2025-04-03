<script lang="ts">
  import type { LayoutProps } from './$types';
  import '../app.css';

  let { children }: LayoutProps = $props();
</script>

<div class="">
  {@render children()}
</div>
