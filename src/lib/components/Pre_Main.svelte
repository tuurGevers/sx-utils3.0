<script>
    let formData = {
        username: "",
        email: "",
        password: ""
    };
</script>

<div sxClass="formStyle:#f8f9fa">
    <!-- Username -->
    <label for="username">
        Username:
    </label>
    <input
            id="username"
            type="text"
            bind:value={formData.username}
            placeholder="Enter your username"
    />

    <!-- Email -->
    <label for="email">
        Email:
    </label>
    <input
            id="email"
            type="email"
            bind:value={formData.email}
            placeholder="Enter your email"
    />

    <!-- Password -->
    <label for="password">
        Password:
    </label>
    <input
            id="password"
            type="password"
            bind:value={formData.password}
            placeholder="Enter your password"
    />

    <!-- Submit Button -->
    <button
            type="submit"
    >
        Register
    </button>
</div>
