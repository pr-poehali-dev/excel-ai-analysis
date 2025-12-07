import json
import os
from typing import Dict, Any, List
import google.generativeai as genai

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Анализирует финансовые данные с помощью ИИ (Gemini или DeepSeek)
    Args: event - dict с httpMethod, body (JSON с данными таблицы)
          context - object с атрибутами request_id, function_name
    Returns: HTTP response с результатами анализа
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    excel_data = body_data.get('excelData', {})
    
    if not excel_data:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Excel data required'}),
            'isBase64Encoded': False
        }
    
    gemini_key = os.environ.get('GEMINI_API_KEY')
    
    if not gemini_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'GEMINI_API_KEY not configured'}),
            'isBase64Encoded': False
        }
    
    genai.configure(api_key=gemini_key)
    model = genai.GenerativeModel('gemini-pro')
    
    headers = excel_data.get('headers', [])
    rows = excel_data.get('rows', [])
    
    table_text = f"Заголовки: {', '.join(headers)}\n\n"
    for row in rows:
        table_text += f"{', '.join(str(cell) for cell in row)}\n"
    
    prompt = f"""Ты финансовый аналитик. Проанализируй данные таблицы:

{table_text}

Верни ТОЛЬКО валидный JSON (без markdown, без комментариев) со следующей структурой:
{{
  "totalRevenue": число (общая сумма доходов),
  "avgRevenue": число (средний доход),
  "growth": число (процент роста),
  "forecast": число (прогноз на следующий период),
  "insights": ["инсайт1", "инсайт2", "инсайт3", "инсайт4"],
  "recommendations": ["рекомендация1", "рекомендация2", "рекомендация3", "рекомендация4"]
}}

Важно: инсайты и рекомендации должны быть конкретными и основанными на данных."""
    
    response = model.generate_content(prompt)
    ai_text = response.text.strip()
    
    if ai_text.startswith('```json'):
        ai_text = ai_text[7:]
    if ai_text.startswith('```'):
        ai_text = ai_text[3:]
    if ai_text.endswith('```'):
        ai_text = ai_text[:-3]
    ai_text = ai_text.strip()
    
    analysis_result = json.loads(ai_text)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(analysis_result, ensure_ascii=False),
        'isBase64Encoded': False
    }
