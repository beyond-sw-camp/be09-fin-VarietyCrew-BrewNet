package com.varc.brewnetapp.exception;

public class InvalidStockException extends RuntimeException{
    public InvalidStockException(String message) {
        super(message);
    }
}
