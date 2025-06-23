<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Session;
use App\Models\Appuser;
use App\Models\Post;
use App\Models\Comment;
use App\Models\Vote;
use App\Models\Save;

class MainController extends BaseController
{
    public function homepage()
    {
        return view('home');
    }

    public function load_vote_and_save($entry, $id)
    {
        $entry_type = ($entry->content) ? 'comment' : 'post';

        $vote_check = Vote::where('voting_user', session('user_id'))
            ->where('entry_type', $entry_type)->where('entry_id', $id)->first();
        if ($vote_check)
            $entry->vote = $vote_check->vote;

        $save_check = Save::where('user', session('user_id'))
            ->where('entry_type', $entry_type)->where('entry_id', $id)->first();
        if ($save_check && $entry_type == 'post')
            $entry->post_saved = 'yes';
        if ($save_check && $entry_type == 'comment')
            $entry->comment_saved = 'yes';
    }

    public function sorter($builder, $sort, $date)
    {
        if ($date != 'comment_date' && $date != 'post_date')
            return null;

        $controversial_query = 'LEAST(upvotes/downvotes,downvotes/upvotes)*(upvotes+downvotes)';

        switch ($sort) {
            case "new":
                $result = $builder->orderBy($date, 'desc')->get(); break;
            case "old":
                $result = $builder->orderBy($date, 'asc')->get(); break;
            case "top":
                if ($date == 'post_date')
                    $result = $builder->orderBy(Post::raw('upvotes - downvotes'), 'desc')->get();
                else
                    $result = $builder->orderBy(Comment::raw('upvotes - downvotes'), 'desc')->get();
                break;
            case "controversial":
                if ($date == 'post_date')
                    $result = $builder->orderBy(Post::raw($controversial_query), 'desc')->get();
                else
                    $result = $builder->orderBy(Comment::raw($controversial_query), 'desc')->get();
                break;
            default:
                $result = $builder->get();
        }
        return $result;
    }

    public function sorter_raw($sort)
    {
        switch ($sort) {
            case "old":
                $order = "all_dates ASC"; break;
            case "top":
                $order = "all_upvotes - all_downvotes DESC"; break;
            case "controversial":
                $order = "LEAST(all_upvotes/all_downvotes, all_downvotes/all_upvotes) * (all_upvotes + all_downvotes) DESC"; break;
            default:
                $order = "all_dates DESC";
        }
        return $order;
    }

    public function load_home($sort='top')
    {
        switch ($sort) {
            case "new":
                $all_posts = Post::orderBy('post_date', 'desc')->get(); break;
            case "old":
                $all_posts = Post::orderBy('post_date', 'asc')->get(); break;
            case "top":
                $all_posts = Post::orderBy(Post::raw('upvotes - downvotes'), 'desc')->get(); break;
            case "controversial":
                $all_posts = Post::orderBy(Post::raw('LEAST(upvotes/downvotes,downvotes/upvotes)*(upvotes+downvotes)'), 'desc')->get(); break;
            default:
                $all_posts = Post::all();
        }
        if (session('user_id'))
            foreach ($all_posts as $post)
                $this->load_vote_and_save($post, $post->id);
        return $all_posts;
    }

    public function go_submit(Request $request)
    {
        if (!session('user_id')) {
            session(['error' => 'required']);
            return redirect('login');
        }
        $new = ($request->new == 'text') ? 'text' : 'link';
        return view('submit')->with('new', $new);;
    }

    public function submit_post(Request $request)
    {
        if (!empty($request->linkurl) && !empty($request->linktitle))
        {
            if (strlen($request->linktitle) > 300 || strlen($request->linktitle) < 1)
                return null;
            $post = new Post;
            $post->author = session('username');
            $post->title = $request->linktitle;
            $post->post_date = date("Y-m-d H-i-s");
            $post->post_url = $request->linkurl;
            $post->save();
            return redirect('home');
        }
        else if (!empty($request->posttitle))
        {
            if (strlen($request->posttitle) > 300)
                return null;
            $post = new Post;
            $post->author = session('username');
            $post->title = $request->posttitle;
            $post->post_date = date("Y-m-d H-i-s");
            if (!empty($request->texturl))
                $post->post_url = $request->texturl;
            if (!empty($request->desc)) {
                if (strlen($request->desc) > 2000)
                    return null;
                $post->post_desc = $request->desc;
            }
            $post->save();
            return redirect('post/'.$post->id);
        }   
    }

    public function load_comments($id, $sort='top')
    {
        $builder = Comment::where('post', $id)->orderBy('parent');
        $all_comments = $this->sorter($builder, $sort, 'comment_date');
        if (session('user_id'))
            foreach ($all_comments as $comment)
                $this->load_vote_and_save($comment, $comment->id);
        return $all_comments;
    }

    public function open_post($id)
    {
        $post = Post::find($id);
        if (!$post)
            redirect('home');
        else {
            if (session('user_id'))
                $this->load_vote_and_save($post, $post->id);
            return view('article')->with('post', $post);
        }
    }

    public function add_comment(Request $request)
    {
        if (!session('user_id') || empty($request->relpost) || empty($request->content) || strlen($request->content) < 1 || strlen($request->content) > 1000)
            return null;
        $comment = new Comment;
        $comment->author = session('username');
        $comment->comment_date = date("Y-m-d H-i-s");
        $comment->post = $request->relpost;
        $comment->content = $request->content;
        if (!empty($request->parent))
            $comment->parent = $request->parent;
        $comment->save();

        $parent_post = Post::find($request->relpost);
        $parent_count = Comment::where('post', $request->relpost)->get();
        $parent_post->comment_count = count($parent_count);
        $parent_post->save();

        return $comment;
    }

    public function open_profile($name)
    {
        return ($user = Appuser::where('username', $name)->first())
            ? view('profile')->with('prof', $user)
            : redirect('home');
    }

    public function get_profile($name, $option='all', $sort='new')
    {
        if ($option == 'posts')
        {
            $posts = $this->sorter(Post::where('author', $name), $sort, 'post_date');
            foreach ($posts as $each_post)
                $this->load_vote_and_save($each_post, $each_post->id);
            return $posts;
        }
        else if ($option == 'comments')
        {
            $comments = $this->sorter(Comment::where('author', $name), $sort, 'comment_date');
            foreach ($comments as $each_comm) {
                $parent_post = $each_comm->getPost()->first();
                $each_comm->parent_post = $parent_post->id;
                $each_comm->parent_author = $parent_post->author;
                $each_comm->parent_title = $parent_post->title;
                $each_comm->parent_count = $parent_post->comment_count;
                $this->load_vote_and_save($each_comm, $each_comm->id);
            }
            return $comments;
        }
        else if ($option == 'all')
        {
            $order = $this->sorter_raw($sort);
            $query = "SELECT t1.id comment_id, t1.content, COALESCE(t1.upvotes,'') || COALESCE(t4.upvotes,'') AS all_upvotes,
                COALESCE(t1.downvotes,'') || COALESCE(t4.downvotes,'') AS all_downvotes,
                t2.id parent_post, t2.author parent_author, t2.title parent_title, t2.comment_count parent_count,
                t3.all_dates, t4.id post_id, t4.title post_title, t4.comment_count, t4.post_url
                FROM (SELECT * FROM comments WHERE author = ?) t1
                LEFT OUTER JOIN (SELECT id, author, title, comment_count FROM posts) t2 ON t1.post = t2.id
                RIGHT JOIN ((SELECT comment_date all_dates FROM comments WHERE author = ?)
                UNION (SELECT post_date all_dates FROM posts WHERE author = ?)) t3 ON t1.comment_date = t3.all_dates
                LEFT JOIN (SELECT * FROM posts WHERE author = ?) t4 ON t4.post_date = t3.all_dates ORDER BY $order";
            $res = DB::select($query, [$name, $name, $name, $name]);
            if (session('user_id')) {
                foreach ($res as $entry) {
                    if ($entry->comment_id)
                        $this->load_vote_and_save($entry, $entry->comment_id);
                    else if ($entry->post_id)
                        $this->load_vote_and_save($entry, $entry->post_id);
                }
            }
            return $res;
        }
    }

    public function get_saves($sort='new')
    {
        if (!session('user_id'))
            return null;
        $order = $this->sorter_raw($sort);
        $query = "SELECT t1.id comment_id, t1.author, t1.post, t1.content, t1.parent, t2.id parent_post,
            t2.author, t2.title parent_title, t2.comment_count parent_count,
            COALESCE(t1.upvotes,'') || COALESCE(t4.upvotes,'') AS all_upvotes,
            COALESCE(t1.downvotes,'') || COALESCE(t4.downvotes,'') AS all_downvotes,
            t3.comment_date all_dates, t4.id post_id, t4.author, t4.title post_title,
            t4.comment_count, t4.post_desc, t4.post_url, 'yes' post_saved, 'yes' comment_saved
            FROM (SELECT c1.* FROM comments c1
            JOIN (SELECT * FROM saves WHERE entry_type = 'comment' AND user = ?) s1 ON c1.id = s1.entry_id) t1
            LEFT OUTER JOIN (SELECT id, author, title, comment_count FROM posts) t2 ON t1.post = t2.id
            RIGHT JOIN (
                (SELECT comment_date FROM comments c2 JOIN (SELECT * FROM saves WHERE entry_type = 'comment' AND user = ?) s3 ON c2.id = s3.entry_id)
                UNION (SELECT post_date FROM posts p2 JOIN (SELECT * FROM saves WHERE entry_type = 'post' AND user = ?) s4 ON p2.id = s4.entry_id)
            ) t3 ON t1.comment_date = t3.comment_date
            LEFT JOIN (SELECT p1.* FROM posts p1 JOIN (SELECT * FROM saves WHERE entry_type = 'post' AND user = ?) s2 ON p1.id = s2.entry_id) t4
                ON t4.post_date = t3.comment_date ORDER BY $order";
        $res = DB::select($query, [session('user_id'), session('user_id'), session('user_id'), session('user_id')]);
        foreach ($res as $entry) {
            if ($entry->comment_id)
                $this->load_vote_and_save($entry, $entry->comment_id);
            else if ($entry->post_id)
                $this->load_vote_and_save($entry, $entry->post_id);
        }
        return $res;
    }
}