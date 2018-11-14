FROM node:10

RUN mkdir -p /var/www/app
WORKDIR /var/www/app

# add to $PATH
ENV PATH /var/www/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package*.json /var/www/app/
RUN npm install
RUN npm i -g @adonisjs/cli
RUN npm install pg --save

# start app
CMD ["adonis", "serve", "--dev"]