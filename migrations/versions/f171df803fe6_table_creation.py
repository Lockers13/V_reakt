"""table creation

Revision ID: f171df803fe6
Revises: c50afae5e9b0
Create Date: 2020-05-21 20:00:39.735892

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f171df803fe6'
down_revision = 'c50afae5e9b0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('reaction',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('reaction_string', sa.Text(length=16000000), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('video_id', sa.Integer(), nullable=True),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['video_id'], ['video.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_reaction_timestamp'), 'reaction', ['timestamp'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_reaction_timestamp'), table_name='reaction')
    op.drop_table('reaction')
    # ### end Alembic commands ###
