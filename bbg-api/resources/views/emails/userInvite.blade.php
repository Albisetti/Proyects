<html>

<head>
    <style>
    h1 {
        color: red;
    }

    p {
        color: black;
        font-size: 1.4rem;
    }



    .emailWrapper {
        display: flex;
        flex-direction: column;

    }

    .headerWrapper {

        display: flex;
        background: white;
        padding: 0.5rem 8rem;
        align-items: center;
    }

    .bodyWrapper {
        padding: 1rem 8rem;
        background: rgba(43, 37, 37, 0.07);
    }

    .mainBody {
        background: white;
        min-height: 600px;
        padding: 0.2rem 0.5rem;
        border-radius: 0.5rem;
    }

    .newPasswordWrapper {
        display: flex;
        align-items: center;
    }

    .password {
        margin-left: 10px;

    }
    </style>
</head>

<body>
    <div class="emailWrapper">
        <div class="headerWrapper">

            <img src="https://buildersbuyinggroup.com/images/logo-white.svg" width="166px" height="48px" alt="Logo" />
        </div>

        <div class="bodyWrapper">

            <div class="mainBody">
                <p>
                    Welcome to the BBG family!
                </p>

                <div class="newPasswordWrapper">
					<p>Please confirm your account <a href="{!! $webURL !!}/confirm/{!! $passwordSetUrl !!}">with this link</a>.
                </div>
            </div>
        </div>
    </div>

</body>

</html>
