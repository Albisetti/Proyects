<h1>Rules Engine Testing - Factory</h1>

<a href="/debug">Go back</a>

<hr />

<main>
    <form>
        <div>
            <label for="program">Choose program:</label>

            <select name="program">
            @foreach ($programs as $program)
                <option value="{{ $program->id }}">{{ $program->name }}</option>    
            @endforeach
            </select>
        </div>
        <div>
            <label>Date & year today:</label>
            <input type="date" value="" />
        </div>
    </form>
</main>