<?php


namespace App\Helpers;

use App\Models\SystemMessage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class SystemMessageHelpers
{

    public static function dispatchSystemMessage( $message, $message_action, Array $users, $modelName=null, $modelId=null)
    {

        DB::beginTransaction();

        $systemMessages = collect([]);
        try {
            foreach ($users as $user){

                $fields = [
                    'message'=>$message,
                    'message_action'=>$message_action,
                    'user_id'=>$user['id']
                ];

                if( isset($modelName) && isset($modelId) ){
                    $fields['related_entity_type']=$modelName;
                    $fields['related_entity_id']=$modelId;
                }

                $systemMessages->push($fields);
            }

            SystemMessage::insert($systemMessages->toArray());

            DB::commit();
        } catch (\Exception $ex){
            DB::rollBack();
            throw $ex;
        }

        return $systemMessages;
    }
}
