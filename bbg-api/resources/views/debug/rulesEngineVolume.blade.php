<h1>Rules Engine Testing - Volume</h1>

<a href="/debug">Go back</a>

<hr />

<script type="text/javascript">
function onSubmit(form) {
    console.log(form.values);

    return false;
}
</script>

<main>
    <form onsubmit="onSubmit(this);return false">
        <div>
            <label for="program">Choose program:</label>

            <select name="program">
            @foreach ($programs as $program)
                <option value="{{ $program->id }}">{{ $program->name }}</option>    
            @endforeach
            </select>
        </div>

        <div>
            <label for="spend">Spend to date:</label>
            <input type="text" name="spend" placeholder="$1" />
        </div>

        <hr />

        <div>
            <label for="total">Total BBG rebate:</label>
            <input type="text" name="total" />
        </div>

        <hr />

        <button type="submit" id="submitButton">Calculate</button>

        <hr />
    </form>
</main>