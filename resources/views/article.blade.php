<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ $post->title }} - LogoSito</title>
        <link rel="stylesheet" href="{{ url('main.css') }}" />
        <link rel="stylesheet" href="{{ url('misc.css') }}" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans">
        <script>
            const BASE_URL = "{{ url('/') }}";
            function giveToken() {
                return '{{ csrf_token() }}';
            }
        </script>
        <script>
            const START_VOTE = 
            @if ($post->vote)
            '{{ $post->vote }}';
            @else
            null;
            @endif
        </script>
        <script src="{{ url('js/main.js') }}" defer></script>
        <script src="{{ url('js/api.js') }}" defer></script>
        <script src="{{ url('js/comment.js') }}" defer></script>
    </head>
    <body>
        <header>
        <a href="{{ url('home') }}" id="logo"><img src="{{ url('assets/logo.png') }}"></a>
        <nav>
            <a href="{{ url('home') }}">back to home</a>
        </nav>
        <div>
            @if (session('username'))
            <a id="current-user" href="{{ url('profile/'.session('username')) }}">{{ session('username') }}</a> | <a href="{{ url('logout') }}">logout</a>
            @else
            Want to join? <a href="{{ url('login') }}">Log in</a> or <a href="{{ url('login') }}">sign up</a> in seconds.
            @endif
        </div>
        </header>
        <div class="main">
            <section>
                <article data-id="{{ $post->id }}">
                    <div class="votes">
                        <img class="arrow" data-arrow="up" src="{{ url('assets/arrowup.png') }}">
                        <div class="score" data-vote="none">{{ $post->upvotes - $post->downvotes }}</div>
                        <img class="arrow" data-arrow="down" src="{{ url('assets/arrowdown.png') }}">
                    </div>
                    <div class="entry">
                        <p class="title">
                            <a href="{{ url('post/'.$post->id) }}">{{ $post->title }}</a>
                            @if (!empty($post->post_url))
                            <span class="domain">(<a href="{{ $post->post_url }}">{{ $post->post_url }}</a>)</span>
                            @endif
                        </p>
                        <p class="tagline">
                            submitted by<a href="{{ url('profile/'.$post->author) }}" class="author">{{ $post->author }}</a>
                            @if ($post->post_saved)
                            <img src="{{ url('assets/saved.png') }}">
                            @endif
                        </p>
                        @if (!empty($post->post_desc))
                        <div class="post-text">{{ $post->post_desc }}</div>
                        @endif
                        <div class="buttons">
                            <a>comment</a>
                            <span><a class="share">share</a></span>
                            @if ($post->post_saved)
                            <a data-func="save">unsave</a>
                            @else
                            <a data-func="save">save</a>
                            @endif
                            @if ($post->author == session('username'))
                            <a data-func="delete">delete</a>
                            @endif
                        </div>
                    </div>
                </article>
                <div class="comment-area">
                    <div class="comment-title">{{ $post->comment_count }} comments</div>
                    <div class="comment-menu">
                    <span>sorted by:</span>
                    <div class="dropdown">
                        <span>top</span><img src="{{ url('assets/arrowsort.png') }}">
                    </div>
                    <div class="drop-choices hidden">
                        <a href="#">top</a>
                        <a href="#">new</a>
                        <a href="#">controversial</a>
                        <a href="#">old</a>
                    </div>
                    </div>
                    @if (session('username'))
                    <div class="main-comment-maker">
                        <form id="postcomment" method="post">
                            @csrf
                            <textarea name="content" placeholder="What are your thoughts?"></textarea>
                            <input type='hidden' name='noparent' value='yes'>
                            <input type='hidden' name='relpost' value='{{ $post-> id }}'>
                            <div>
                                <button type="submit">save</button>
                                <span data-val="0">0/1000</span>
                            </div>
                        </form>
                    </div>
                    @else
                    <div class="comment-signup">
                        <a href="{{ url('login') }}">
                        <h3>Want to add to the discussion?</h3>
                        <p>Post a comment!</p>
                        <span>Create an account</span>
                        </a>
                    </div>
                    @endif
                </div>
            </section>
            <div class="side">
                <form id="search" name="sitesearch" method="post">
                    @csrf
                    <input type="text" id="searchbar" name="bar" placeholder="search here">
                    <input type="submit" value="">
                </form>
                @if (!session('username'))
                <form id="homelogin" method="post">
                    @csrf
                    <input type="text" name="logname" placeholder="username">
                    <input type="password" name="logpw" placeholder="password">
                    <div>
                        <span>
                            <input id="rem-login" type="checkbox" name="rem">
                            <label for="rem-login">remember me</label>
                            <a href="#">reset password</a>
                        </span>
                        <button type="submit">login</button>
                    </div>
                </form>
                @endif
                <div class="linkinfo">
                    <span>this post was submitted on {{ $post->post_date }}</span>
                <div>
                    <span class="number">{{ $post->upvotes - $post->downvotes }}</span>
                    <span>points</span>
                    @if ($post->upvotes + $post->downvotes != 0)
                    ({{ (($post->upvotes - $post->downvotes)*100)/($post->upvotes + $post->downvotes) }}% upvoted)
                    @else
                    (0% upvoted)
                    @endif
                </div>
                <div class="shortlink">
                    shortlink:
                    <input type="text" value="https://logo.st/{{ $post->id }}">
                </div>
                </div>
                <a class="submit-new" href="{{ url('submit') }}">Submit a new link</a>
                <a class="submit-new" href="{{ url('submit') }}">Submit a new text post</a>
                <div id="holidays" class="whitediv"><h2>Holidays in the world:</h2></div>
            </div>
        </div>
        <footer>
        <div id="footer-menu">
            <div class="col firstcol">
            <span>about</span><br>
            <a href="#">blog</a><br>
            <a href="#">about</a><br>
            <a href="#">advertising</a>
            </div>
            <div class="col">
            <span>help</span><br>
            <a href="#">help</a><br>
            <a href="#">FAQ</a><br>
            <a href="#">mod guidelines</a><br>
            <a href="#">contact us</a>
            </div>
            <div class="col">
            <span>tools</span><br>
            <a href="#">mobile app</a><br>
            <a href="#">source code</a><br>
            <a href="#">rss feed</a>
            </div>
        </div>
        <p>Vitae eligendi nobis consequuntur unde incidunt ratione ad. Consectetur esse sunt autem temporibus. © 2025 Aut at eos soluta.<br>Aperiam odio sed sit expedita.</p>
        </footer>
    </body>
</html>