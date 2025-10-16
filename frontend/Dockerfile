FROM node:current-alpine3.21

RUN mkdir frontend

RUN cd frontend

COPY . .
RUN npm install
RUN npm run build
CMD [ "npm", "run", "start" ]