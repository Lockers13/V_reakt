"""empty message

Revision ID: 474794eae89f
Revises: 4b5ec3b176e1
Create Date: 2020-05-24 22:29:27.753443

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '474794eae89f'
down_revision = '4b5ec3b176e1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('video', 'reaction_stats')
    op.drop_column('video', 'num_reactions')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('video', sa.Column('num_reactions', mysql.INTEGER(display_width=11), autoincrement=False, nullable=True))
    op.add_column('video', sa.Column('reaction_stats', mysql.LONGTEXT(), nullable=True))
    # ### end Alembic commands ###
