import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    product_code = Column(String, unique=True, index=True)
    manufacturer = Column(String, index=True)
    batch_number = Column(String)
    manufacturing_date = Column(DateTime, default=datetime.datetime.utcnow)
    warranty_terms = Column(String)

class FingerprintRecord(Base):
    __tablename__ = "fingerprints"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    image_path = Column(String)
    embedding = Column(Text) # Store as JSON string for simplicity in SQLite
    embedding_hash = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    product = relationship("Product")

class VerificationAttempt(Base):
    __tablename__ = "verifications"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    image_path = Column(String)
    match_score = Column(Float)
    verdict = Column(String)
    explainability_factors = Column(Text) # JSON string
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class OwnershipTransfer(Base):
    __tablename__ = "ownership_transfers"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    previous_owner = Column(String)
    new_owner = Column(String)
    transfer_date = Column(DateTime, default=datetime.datetime.utcnow)

class LedgerRecord(Base):
    __tablename__ = "ledger"

    id = Column(Integer, primary_key=True, index=True)
    record_type = Column(String)
    record_data_json = Column(Text)
    prev_hash = Column(String)
    record_hash = Column(String, unique=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
