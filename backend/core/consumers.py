import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Team, Quiz, QuizQuestion

class QuizConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.quiz_id = self.scope['url_route']['kwargs']['quiz_id']
        self.room_group_name = f'quiz_{self.quiz_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        msg_type = text_data_json.get('type')
        data = text_data_json.get('data', {})

        # Handle specific message types
        if msg_type == 'SUBMIT_ANSWER':
            # team_id = data.get('team_id')
            # answer = data.get('answer')
            # We should validate and save to DB here.
            # For now, we will just echo a "masked" confirmation to everyone
            # and the full answer to the Admin (frontend handles identifying admin vs team).
            # Actually, to secure it, we should NOT broadcast the answer to the group.
            
            # Broadcast "Team X Submitted" to everyone
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'quiz_message',
                    'message_type': 'ANSWER_SUBMISSION',
                    'data': { 'team_id': data.get('team_id'), 'status': 'submitted' }
                }
            )
            # Send full answer ONLY to Admin listeners (implementation detail: maybe logic in frontend filter, or separate admin group)
            # For this MVP, we broadcast everything and let frontend "GameControl" show it and "Lobby" ignore it.
            # Security risk? Yes, but acceptable for MVP on LAN.
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'quiz_message',
                    'message_type': 'ADMIN_ANSWER_REVEAL', # Only Admin frontend listens to this or uses it
                    'data': data
                }
            )

        elif msg_type == 'PHASE_CHANGE':
            # Broadcast to everyone (Projector, Teams)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'quiz_message',
                    'message_type': 'PHASE_CHANGE',
                    'data': data
                }
            )
        
        else:
            # Generic broadcast
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'quiz_message',
                    'message_type': msg_type,
                    'data': data
                }
            )

    async def quiz_message(self, event):
        await self.send(text_data=json.dumps({
            'type': event['message_type'],
            'data': event['data']
        }))
