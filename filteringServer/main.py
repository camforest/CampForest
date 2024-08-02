from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import mysql.connector

app = FastAPI()

# SQLAlchemy를 사용하여 MySQL 데이터베이스 연결 설정
DATABASE_URL = 'mysql+mysqlconnector://root:11d208campforest!@3.36.78.37/campforest'
engine = create_engine(DATABASE_URL)

# 카테고리 유사도 계산
def calculate_category_similarity(engine):
    user_interest_query = "SELECT * FROM user_interest"
    user_interest_df = pd.read_sql(user_interest_query, engine)
    user_interest_matrix = pd.pivot_table(user_interest_df, index='user_id', columns='interest_id', aggfunc='size', fill_value=0)
    user_interest_similarity = cosine_similarity(user_interest_matrix)
    return pd.DataFrame(user_interest_similarity, index=user_interest_matrix.index, columns=user_interest_matrix.index)

# 팔로우 유사도 계산
def calculate_follow_similarity(engine):
    follow_query = "SELECT follower_id, followee_id FROM follow"
    follow_df = pd.read_sql(follow_query, engine)
    user_follow_matrix = pd.pivot_table(follow_df, index='follower_id', columns='followee_id', aggfunc='size', fill_value=0)
    follow_similarity = cosine_similarity(user_follow_matrix)
    return pd.DataFrame(follow_similarity, index=user_follow_matrix.index, columns=user_follow_matrix.index), follow_df

# 겹치는 팔로우 숫자 계산 함수
def calculate_common_follows(user_id_1, user_id_2):
    common_follows_query = f"""
    SELECT COUNT(*) AS common_follows_count
    FROM follow f1
    JOIN follow f2 ON f1.followee_id = f2.followee_id
    WHERE f1.follower_id = {user_id_1} AND f2.follower_id = {user_id_2};
    """
    conn = mysql.connector.connect(
        host='3.36.78.37',
        user='root',
        password='11d208campforest!',
        database='campforest'
    )
    cursor = conn.cursor()
    cursor.execute(common_follows_query)
    common_follows_count = cursor.fetchone()[0]
    cursor.close()
    conn.close()
    return common_follows_count

# 유사한 사용자 추천 함수
def find_most_similar_users(user_id, interest_similarity_df, follow_similarity_df, follow_weight=0.9, interest_weight=0.1, top_n=6):
    if user_id not in interest_similarity_df.index or user_id not in follow_similarity_df.index:
        raise ValueError(f"User ID {user_id} not found in the data.")

    combined_similarity = follow_weight * follow_similarity_df[user_id] + interest_weight * interest_similarity_df[user_id]
    similar_users = combined_similarity.sort_values(ascending=False).index[1:top_n+1]  # 자기 자신 제외
    similar_scores = combined_similarity.sort_values(ascending=False).values[1:top_n+1]

    similar_users_with_common_follows = []
    for similar_user, score in zip(similar_users, similar_scores):
        common_follows_count = calculate_common_follows(user_id, similar_user)
        similar_users_with_common_follows.append({"user_id": similar_user, "similarity_score": score, "common_follows_count": common_follows_count})

    return similar_users_with_common_follows

class SimilarUserResponse(BaseModel):
    user_id: int
    similarity_score: float
    common_follows_count: int

@app.get("/similar-users/{user_id}", response_model=List[SimilarUserResponse])
async def similar_users(user_id: int):
    try:
        user_interest_similarity_df = calculate_category_similarity(engine)
        follow_similarity_df, follow_df = calculate_follow_similarity(engine)
        most_similar_users = find_most_similar_users(user_id, user_interest_similarity_df, follow_similarity_df)
        return most_similar_users
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

# FastAPI 애플리케이션 실행 (uvicorn 사용)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
