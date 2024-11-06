import express from 'express';

export const bodyParsers = [
  express.json(),
  express.urlencoded({ extended: true }),
]
