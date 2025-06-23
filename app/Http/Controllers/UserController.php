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
use App\Models\WikiSave;

class UserController extends BaseController
{
    public function send_desc(Request $request)
    {
        if (!session('user_id') || strlen($request->desc) > 255)
            return null;

        $user = Appuser::find(session('user_id'));
        $user->user_desc = (!empty($request->desc))
            ? $request->desc : null;
        $user->save();
        return array('new_desc' => $user->user_desc);
    }

    public function update_votes($input_entry, $entry_type, $id) {
        $input_entry->upvotes = count(Vote::where('entry_type', $entry_type)->where('entry_id', $id)->where('vote', 'up')->get());
        $input_entry->downvotes = count(Vote::where('entry_type', $entry_type)->where('entry_id', $id)->where('vote', 'down')->get());
        $input_entry->save();
    }

    public function vote($vote_type, $entry, $id)
    {
        if (!session('user_id') || ($vote_type != 'up' && $vote_type != 'down' && $vote_type != 'remove') || ($entry != 'comment' && $entry != 'post') || empty($id))
            return null;

        $check_vote = Vote::where('voting_user', session('user_id'))->where('entry_type', $entry)->where('entry_id', $id)->first();
        if ($check_vote && $vote_type == 'remove')
            $check_vote->delete();
        else if ($check_vote) {
            $check_vote->vote = $vote_type;
            $check_vote->save();
        } else {
            $new_vote = new Vote;
            $new_vote->voting_user = session('user_id');
            $new_vote->entry_type = $entry;
            $new_vote->entry_id = $id;
            $new_vote->vote = $vote_type;
            $new_vote->save();
        }
        $voted_entry = ($entry == 'post') ? Post::find($id) : Comment::find($id);
        $this->update_votes($voted_entry, $entry, $id);

        DB::statement("UPDATE appusers SET ".$entry."_points = (
            SELECT SUM(upvotes) - SUM(downvotes) FROM ".$entry."s WHERE author = (
            SELECT author FROM ".$entry."s WHERE id = $id))
            WHERE username = (SELECT author FROM ".$entry."s WHERE id = $id)");
    }

    public function save($entry, $id, $action='add')
    {
        if (!session('user_id') || ($entry != 'comment' && $entry != 'post') || empty($id))
            return null;

        $check_save = Save::where('user', session('user_id'))->where('entry_type', $entry)->where('entry_id', $id)->first();
        if ($check_save && $action == 'remove')
            $check_save->delete();
        else if (!$check_save) {
            $new_save = new Save;
            $new_save->user = session('user_id');
            $new_save->entry_type = $entry;
            $new_save->entry_id = $id;
            $new_save->save();
        }
    }

    public function save_wiki_article(Request $request)
    {
        if (!session('user_id'))
            return null;
        if ($request->action == 'get')
            return WikiSave::where('wiki_user', session('user_id'))->get();
        if ($request->link && $request->title && $request->action == 'add') {
            if (WikiSave::where('wiki_user', session('user_id'))
                ->where('link', $request->link)->where('title', $request->title)->first())
                return null;
            $article = new WikiSave;
            $article->wiki_user = session('user_id');
            $article->link = $request->link;
            $article->title = $request->title;
            $article->save();
            return $article;
        }
        if ($request->id && $request->action == 'delete') {
            $article = WikiSave::find($request->id);
            if ($article)
                $article->delete();
        }
    }
}