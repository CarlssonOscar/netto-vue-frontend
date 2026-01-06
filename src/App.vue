<script setup lang="ts">
    import Toolbar from 'primevue/toolbar'
</script>

<template>
    <div id="app">
        <header>
            <Toolbar class="app-toolbar">
                <template #start>
                    <span class="app-title">Nettolön</span>
                </template>
            </Toolbar>
        </header>
        <main>
            <router-view />
        </main>
    </div>
</template>

<style>
    #app {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: #f5f5f5;
    }

    header {
        position: sticky;
        top: 0;
        z-index: 1000;
    }

    .app-toolbar {
        background: #ffffff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        border-radius: 0 !important;
    }

    main {
        flex: 1;
    }

    .app-title {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 1.75rem;
        font-weight: 600;
        color: #eb8b10;
    }
</style>
